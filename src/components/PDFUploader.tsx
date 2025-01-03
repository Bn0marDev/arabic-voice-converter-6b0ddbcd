import { useState } from 'react';
import { Button } from './ui/button';
import { FileUp, Download } from 'lucide-react';
import { useToast } from './ui/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker from the installed package
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface PDFUploaderProps {
  onTextExtracted: (text: string) => void;
  audioUrl: string | null;
}

export const PDFUploader = ({ onTextExtracted, audioUrl }: PDFUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File) => {
    try {
      setIsLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }

      onTextExtracted(fullText);
      toast({
        title: "تم استخراج النص بنجاح",
        description: "يمكنك الآن تحويله إلى صوت",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قراءة الملف",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      await extractTextFromPDF(file);
    } else {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف PDF صالح",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative overflow-hidden"
          disabled={isLoading}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <FileUp className="mr-2 h-4 w-4" />
          تحميل ملف PDF
        </Button>
        {audioUrl && (
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            تحميل الملف الصوتي
          </Button>
        )}
      </div>
    </div>
  );
};