import { api } from "@/api/apiClient";
import React, { useEffect, useState } from "react";

interface QRCodeData {
  id: string;
  qrCodeUrl?: {
    secure_url?: string;
    public_id?: string;
  };
  wallentaddress?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminQRPage: React.FC = () => {
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch QR data on mount
  useEffect(() => {
    const fetchQRData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/qr-code/get"); // Adjust endpoint path if needed (e.g., /api/qr/get)
        setQrData(response.data.data); // Assuming SuccessResponse wraps data in 'data' field
        if (response.data.data?.wallentaddress) {
          setWalletAddress(response.data.data.wallentaddress);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch QR data");
      } finally {
        setLoading(false);
      }
    };

    fetchQRData();
  }, []);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim() && !qrImage) {
      setError("At least wallet address or QR image is required");
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const formData = new FormData();
      if (walletAddress.trim()) {
        formData.append("walletaddress", walletAddress.trim());
      }
      if (qrImage) {
        formData.append("qrCodeImage", qrImage);
      }

      const response = await api.put("/qr-code/add", formData, { // Adjust endpoint path if needed
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setQrData(response.data.data); // Update local state with new data
      setPreviewUrl(null); // Clear preview
      setQrImage(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update QR data");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading QR data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin QR Code Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
            {error}
          </div>
        )}

        {/* Current QR Data Display */}
        <div className="bg-card text-card-foreground shadow-sm border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current QR Data</h2>
          {qrData ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Wallet Address</label>
                <p className="mt-1 text-sm text-foreground">{qrData.wallentaddress || "Not set"}</p>
              </div>
              {qrData.qrCodeUrl?.secure_url && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">QR Code Image</label>
                  <img
                    src={qrData.qrCodeUrl.secure_url}
                    alt="Current QR Code"
                    className="mt-2 w-48 h-48 object-contain border border-border rounded-md"
                  />
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Last Updated: {new Date(qrData.updatedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No QR data found. Create one below.</p>
          )}
        </div>

        {/* Update Form */}
        <div className="bg-card text-card-foreground shadow-sm border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Update QR Code</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-muted-foreground">
                Wallet Address
              </label>
              <input
                type="text"
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                placeholder="Enter wallet address (min 26 chars)"
                minLength={26}
                required={true}
              />
            </div>

            <div>
              <label htmlFor="qrImage" className="block text-sm font-medium text-muted-foreground">
                QR Code Image (JPEG, PNG, WEBP - max 10MB)
              </label>
              <input
                type="file"
                id="qrImage"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-4 w-48 h-48 object-contain border border-border rounded-md"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update QR Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminQRPage;