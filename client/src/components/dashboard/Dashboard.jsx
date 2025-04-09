import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUrlsStart,
  fetchUrlsSuccess,
  fetchUrlsFailure,
  createUrlStart,
  createUrlSuccess,
  createUrlFailure,
} from "../../store/slices/urlSlice";
import axios from "axios";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, QrCode, ChartBar, Calendar as CalendarIcon } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:4000/api";

const Dashboard = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [selectedQrUrl, setSelectedQrUrl] = useState(null);

  const dispatch = useDispatch();
  const { urls, loading, error, pagination } = useSelector(
    (state) => state.urls
  );
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUrls();
  }, [pagination.page, searchTerm]);

  const fetchUrls = async (page = pagination.page) => {
    dispatch(fetchUrlsStart());
    try {
      const response = await axios.get(
        `${API_URL}/links?page=${page}&limit=10&search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        dispatch(fetchUrlsSuccess(response.data));
      } else {
        throw new Error(response.data.message || "Failed to fetch URLs");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch URLs";
      dispatch(fetchUrlsFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createUrlStart());
    try {
      const response = await axios.post(
        `${API_URL}/links`,
        {
          originalUrl: longUrl,
          customAlias,
          expirationDate: expirationDate || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        dispatch(createUrlSuccess(response.data));
        toast.success("URL shortened successfully!");
        setLongUrl("");
        setCustomAlias("");
        setExpirationDate("");
        fetchUrls(); // Refresh the list after creating a new URL
      } else {
        throw new Error(response.data.message || "Failed to shorten URL");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to shorten URL";
      dispatch(createUrlFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  const handleViewAnalytics = async (url) => {
    if (!url.id) {
      toast.error("Invalid URL ID");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/links/${url.id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
        setSelectedUrl(response.data.link);
      } else {
        throw new Error(response.data.message || "Failed to fetch analytics");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch analytics";
      toast.error(errorMessage);
    }
  };

  const getShortUrl = (shortCode) => {
    return `${API_URL}/links/${shortCode}`;
  };

  const copyToClipboard = async (shortCode) => {
    try {
      await navigator.clipboard.writeText(getShortUrl(shortCode));
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const generateQRCode = async (shortCode) => {
    try {
      const response = await axios.get(`${API_URL}/links/${shortCode}/qr`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setQrCodeData(response.data.qrCode);
        setSelectedQrUrl(shortCode);
      }
    } catch (error) {
      toast.error("Failed to generate QR code");
    }
  };

  const clicksData = {
    labels: Object.keys(analytics?.clicksByDate || {}),
    datasets: [
      {
        label: "Clicks",
        data: Object.values(analytics?.clicksByDate || {}),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const deviceData = {
    labels: Object.keys(analytics?.devices || {}),
    datasets: [
      {
        label: "Devices",
        data: Object.values(analytics?.devices || {}),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
      },
    ],
  };

  const browserData = {
    labels: Object.keys(analytics?.browsers || {}),
    datasets: [
      {
        label: "Browsers",
        data: Object.values(analytics?.browsers || {}),
        backgroundColor: [
          "rgba(255, 159, 64, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Short URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a shortened version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="longUrl">Long URL</Label>
              <Input
                id="longUrl"
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
              <Input
                id="customAlias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
              <Input
                id="expirationDate"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Short URL"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>
              Manage and track your shortened URLs
            </CardDescription>
          </div>
          <Input
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {urls.map((url) => (
                <Card key={url.id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{url.originalUrl}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
                              {getShortUrl(url.shortCode)}
                            </Badge>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyToClipboard(url.shortCode)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateQRCode(url.shortCode)}
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            QR Code
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleViewAnalytics(url)}
                          >
                            <ChartBar className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            Created:{" "}
                            {new Date(url.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {url.expirationDate && (
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              Expires:{" "}
                              {new Date(
                                url.expirationDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * 10 + 1} to{" "}
              {Math.min(pagination.page * 10, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUrls(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({
                  length: Math.ceil(pagination.total / 10),
                }).map((_, index) => (
                  <Button
                    key={index}
                    variant={
                      pagination.page === index + 1 ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => fetchUrls(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUrls(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / 10)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUrl} onOpenChange={() => setSelectedUrl(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Analytics for {selectedUrl?.shortCode}</DialogTitle>
            <DialogDescription>
              View detailed statistics for your shortened URL
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <Line
                  data={clicksData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  className="h-64"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  data={deviceData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  className="h-64"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Browser Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  data={browserData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  className="h-64"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Clicks
                    </p>
                    <p className="text-2xl font-bold">
                      {analytics?.totalClicks || 0}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          analytics?.isExpired ? "destructive" : "success"
                        }
                      >
                        {analytics?.isExpired ? "Expired" : "Active"}
                      </Badge>
                      {selectedUrl?.expirationDate && (
                        <span className="text-sm text-muted-foreground">
                          Expires:{" "}
                          {new Date(
                            selectedUrl.expirationDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Original URL
                    </p>
                    <p className="text-sm font-medium break-all">
                      {selectedUrl?.originalUrl}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedQrUrl}
        onOpenChange={() => setSelectedQrUrl(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code for {selectedQrUrl}</DialogTitle>
            <DialogDescription>
              Scan this QR code to access your shortened URL
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {qrCodeData && (
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="max-w-[300px] w-full h-auto"
                />
              )}
            </div>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                if (qrCodeData) {
                  const link = document.createElement("a");
                  link.href = qrCodeData;
                  link.download = `qr-code-${selectedQrUrl}.png`;
                  link.click();
                }
              }}
            >
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Dashboard;
