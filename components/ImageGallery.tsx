import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: { url: string; width?: number; height?: number }[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => (prev + 1) % images.length),
    onSwipedRight: () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length),
  });

  const renderThumbnails = () => {
    switch (images.length) {
      case 1:
        return (
          <div className="cursor-pointer">
            <Image
              src={images[0].url}
              alt="Embedded image"
              width={images[0].width || 500}
              height={images[0].height || 300}
              layout="responsive"
              objectFit="cover"
              onClick={() => {
                setOpenImage(images[0].url);
                setCurrentIndex(0);
              }}
            />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="cursor-pointer">
                <Image
                  src={image.url}
                  alt={`Embedded image ${index + 1}`}
                  width={image.width || 250}
                  height={image.height || 250}
                  layout="responsive"
                  objectFit="cover"
                  onClick={() => {
                    setOpenImage(image.url);
                    setCurrentIndex(index);
                  }}
                />
              </div>
            ))}
          </div>
        );
      case 3:
      case 4:
        return (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer ${index === 0 && images.length === 3 ? 'col-span-2' : ''}`}
              >
                <Image
                  src={image.url}
                  alt={`Embedded image ${index + 1}`}
                  width={image.width || 250}
                  height={image.height || 250}
                  layout="responsive"
                  objectFit="cover"
                  onClick={() => {
                    setOpenImage(image.url);
                    setCurrentIndex(index);
                  }}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderThumbnails()}
      <Dialog open={!!openImage} onOpenChange={() => setOpenImage(null)}>
        <DialogContent className="max-w-4xl p-0" {...handlers}>
          <div className="relative">
            <Image
              src={images[currentIndex].url}
              alt="Full size image"
              layout="responsive"
              width={1000}
              height={1000}
              objectFit="contain"
            />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;