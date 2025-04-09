import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <FileQuestion className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-xl">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button variant="default" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
