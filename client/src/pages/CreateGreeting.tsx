import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gift, Upload, X, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const createGreetingSchema = z.object({
  recipientName: z.string().min(1, "Please enter the recipient's name"),
  recipientAge: z.coerce.number().min(1).max(150, "Please enter a valid age"),
});

type CreateGreetingForm = z.infer<typeof createGreetingSchema>;

export default function CreateGreeting() {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateGreetingForm>({
    resolver: zodResolver(createGreetingSchema),
    defaultValues: {
      recipientName: "",
      recipientAge: 0,
    },
  });

  const createGreetingMutation = useMutation({
    mutationFn: async (data: CreateGreetingForm & { files: File[] }) => {
      const formData = new FormData();
      formData.append("recipientName", data.recipientName);
      formData.append("recipientAge", data.recipientAge.toString());
      
      data.files.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await fetch("/api/greetings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create greeting");
      }

      return response.json();
    },
    onSuccess: (greeting) => {
      const link = `${window.location.origin}/wish/${greeting.id}`;
      setGeneratedLink(link);
      toast({
        title: "Birthday wish created!",
        description: "Your magical birthday surprise is ready to share",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photoFiles.length + files.length > 12) {
      toast({
        title: "Too many photos",
        description: "You can upload a maximum of 12 photos",
        variant: "destructive",
      });
      return;
    }

    const newFiles = Array.from(files);
    setPhotoFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CreateGreetingForm) => {
    if (photoFiles.length < 2) {
      toast({
        title: "More photos needed",
        description: "Please upload at least 2 photos",
        variant: "destructive",
      });
      return;
    }

    createGreetingMutation.mutate({ ...data, files: photoFiles });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied!",
      description: "Share it with the birthday person",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Gift className="w-10 h-10 text-primary animate-bounce-slow" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Birthday Wishes
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Create a magical birthday surprise with photos and animations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload Photos
              </h2>

              <div className="space-y-4">
                <Label
                  htmlFor="photo-upload"
                  className="block cursor-pointer"
                  data-testid="label-photo-upload"
                >
                  <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-12 text-center transition-colors hover-elevate">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-foreground font-medium mb-1">
                      Click to upload photos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload 2-12 photos (JPG, PNG)
                    </p>
                  </div>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="input-photo-upload"
                  />
                </Label>

                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photoPreviews.map((photo, index) => (
                      <div
                        key={index}
                        className="relative group animate-scale-in rounded-xl overflow-hidden"
                      >
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removePhoto(index)}
                          data-testid={`button-remove-photo-${index}`}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Birthday Details
              </h2>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient's Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter their name"
                          {...field}
                          data-testid="input-recipient-name"
                          className="text-base p-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="How old are they turning?"
                          {...field}
                          data-testid="input-recipient-age"
                          className="text-base p-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-6 rounded-full"
              data-testid="button-generate"
              disabled={createGreetingMutation.isPending}
            >
              {createGreetingMutation.isPending ? (
                <>Generating...</>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Generate Birthday Wish
                </>
              )}
            </Button>
          </form>
        </Form>

        {generatedLink && (
          <Card className="p-8 mt-8 animate-scale-in bg-gradient-to-br from-primary/10 to-primary/5">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Your Birthday Wish is Ready!
            </h3>
            <p className="text-muted-foreground mb-4">
              Share this link with the birthday person:
            </p>
            <div className="flex gap-2">
              <Input
                value={generatedLink}
                readOnly
                data-testid="input-generated-link"
                className="font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                data-testid="button-copy-link"
                size="icon"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
