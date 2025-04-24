
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";

interface FileUploaderProps {
  onDataLoaded: (data: string, append: boolean) => void;
  isLoading: boolean;
}

const FileUploader = ({ onDataLoaded, isLoading }: FileUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a valid CSV file",
        variant: "destructive",
      });
      event.target.value = "";
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Check if we already have data
      if (hasExistingData) {
        setShowDialog(true);
        return;
      }
      
      // First upload
      onDataLoaded(content, false);
      setHasExistingData(true);
      toast({
        title: "Upload successful",
        description: "Your data has been loaded successfully",
      });
    };

    reader.readAsText(file);
  };

  const handleDataAction = (append: boolean) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onDataLoaded(content, append);
      setShowDialog(false);
      toast({
        title: "Data updated",
        description: append ? "New data has been appended" : "Data has been replaced",
      });
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex-1 w-full">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
          className="w-full sm:w-auto"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {isLoading ? "Uploading..." : "Upload CSV"}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Existing Data</DialogTitle>
            <DialogDescription>
              Would you like to replace the existing data or append the new data to it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDataAction(false)}>
              Replace Data
            </Button>
            <Button onClick={() => handleDataAction(true)}>
              Append Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploader;
