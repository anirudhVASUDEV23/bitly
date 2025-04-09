import Link from "../models/Link.js";
import shortid from "shortid";
import QRCode from "qrcode";
import { isValidUrl } from "../utils/validation.js";

// Create a new shortened link
export const createLink = async (req, res) => {
  try {
    const { originalUrl, customAlias, expirationDate } = req.body;
    const userId = req.user.id;

    if (!isValidUrl(originalUrl)) {
      res.status(400).json({ success: false, message: "Invalid URL format" });
      return;
    }

    /*
    Let's say the original URL is:

   https://www.example.com/my-awesome-article
   Without a custom alias, your system might generate:

   https://yourapp.com/abc123
   But with a customAlias = "awesome-article", the shortened link becomes:

  https://yourapp.com/awesome-article
    */

    let shortCode = customAlias || shortid.generate();

    if (customAlias) {
      const existingLink = await Link.findOne({ shortCode: customAlias });
      if (existingLink) {
        res
          .status(400)
          .json({ success: false, message: "Custom alias already in use" });
        return;
      }
    }

    const link = new Link({
      originalUrl,
      shortCode,
      userId,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      clickEvents: [],
    });

    await link.save();

    res.status(201).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        clicks: link.clicks,
        createdAt: link.createdAt,
        expirationDate: link.expirationDate,
      },
    });
  } catch (error) {
    console.error("Create link error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Redirect from short URL to original URL
export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const link = await Link.findOne({ shortCode });

    if (!link) {
      res.status(404).json({ success: false, message: "URL not found" });
      return;
    }

    if (link.expirationDate && new Date() > link.expirationDate) {
      res.status(410).json({ success: false, message: "Link has expired" });
      return;
    }

    const clickEvent = {
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer || req.headers.referrer,
      location: req.headers["x-forwarded-for"] || req.ip,
    };

    link.clickEvents.push(clickEvent);
    link.clicks += 1;
    await link.save();

    res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get analytics for a specific link
export const getLinkAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;
    const userId = req.user.id;

    const link = await Link.findOne({ _id: linkId, userId });

    if (!link) {
      res.status(404).json({ success: false, message: "Link not found" });
      return;
    }

    const analytics = {
      totalClicks: link.clicks,
      isExpired: link.expirationDate ? new Date() > link.expirationDate : false,
      clicksByDate: {},
      devices: {},
      browsers: {},
      referrers: {},
    };

    link.clickEvents.forEach((event) => {
      const date = event.timestamp.toISOString().split("T")[0];
      analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;

      if (event.userAgent) {
        const userAgent = event.userAgent.toLowerCase();

        if (userAgent.includes("mobile")) {
          analytics.devices["mobile"] = (analytics.devices["mobile"] || 0) + 1;
        } else if (userAgent.includes("tablet")) {
          analytics.devices["tablet"] = (analytics.devices["tablet"] || 0) + 1;
        } else {
          analytics.devices["desktop"] =
            (analytics.devices["desktop"] || 0) + 1;
        }

        if (userAgent.includes("chrome")) {
          analytics.browsers["chrome"] =
            (analytics.browsers["chrome"] || 0) + 1;
        } else if (userAgent.includes("firefox")) {
          analytics.browsers["firefox"] =
            (analytics.browsers["firefox"] || 0) + 1;
        } else if (userAgent.includes("safari")) {
          analytics.browsers["safari"] =
            (analytics.browsers["safari"] || 0) + 1;
        } else if (userAgent.includes("edge")) {
          analytics.browsers["edge"] = (analytics.browsers["edge"] || 0) + 1;
        } else {
          analytics.browsers["other"] = (analytics.browsers["other"] || 0) + 1;
        }
      }

      if (event.referrer) {
        const referrer = new URL(event.referrer).hostname;
        analytics.referrers[referrer] =
          (analytics.referrers[referrer] || 0) + 1;
      } else {
        analytics.referrers["direct"] =
          (analytics.referrers["direct"] || 0) + 1;
      }
    });

    res.json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        createdAt: link.createdAt,
        expirationDate: link.expirationDate,
        isExpired: analytics.isExpired,
      },
      analytics,
    });
  } catch (error) {
    console.error("Get link analytics error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all links for a user with pagination and search
export const getUserLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    let query = { userId };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: "i" } },
        { shortCode: { $regex: search, $options: "i" } },
      ];
    }

    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Link.countDocuments(query);

    const processedLinks = links.map((link) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      clicks: link.clicks,
      createdAt: link.createdAt,
      expirationDate: link.expirationDate,
      isExpired: link.expirationDate ? new Date() > link.expirationDate : false,
    }));

    res.json({
      success: true,
      links: processedLinks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user links error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Generate QR code for a link
export const generateQRCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const baseUrl = process.env.BASE_URL || `http://${req.headers.host}`;
    const fullUrl = `${baseUrl}/api/links/${shortCode}`;

    const qrCode = await QRCode.toDataURL(fullUrl);

    res.json({
      success: true,
      qrCode,
    });
  } catch (error) {
    console.error("Generate QR code error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
