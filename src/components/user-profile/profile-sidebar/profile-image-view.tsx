import Image from "next/image";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type props = {
  src: string
  alt: string
}

function ProfileImageView({ src, alt }: props) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={alt}
            className="absolute inset-0 rounded-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="rounded-full object-cover border-4 border-primary/20"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">Profile picture in full size.</DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-[3/4] max-h-[75vh]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 576px"
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileImageView
