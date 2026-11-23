"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDeleteImage, useUpdateProfile } from "@/hooks/use-user";
import { MAX_GALLERY_IMAGES } from "@/utils/enums";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@glraj/ui/card";

import EditProfileImageDialog from "./edit-profile-image-dialog";
import ProfileImageView from "./profile-image-view";
import AddImageDialog from "./add-image-dialog";
import ImageView from "./image-view";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

function ProfileSidebar({ user, canEdit }: props) {
  const t = useTranslations("shared.userProfile.sidebar")
  const { mutate, isPending } = useUpdateProfile()
  const { mutate: removeImage, isPending: isDeleting } = useDeleteImage()

  const handleDeleteImage = (imageUrl: string) => {
    const isAdmin = window.location.pathname.includes("admin")
    removeImage({ url: imageUrl, ...(isAdmin && { _id: user._id }) })
  }

  function setAsProfilePic(url: string) {
    const isAdmin = window.location.pathname.includes("admin")
    mutate({
      ...(isAdmin && { _id: user._id }),
      profileImg: url
    })
  }

  return (
    <div className="relative isolate max-w-md">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-40 h-40 mb-4">
              <ProfileImageView
                src={user?.profileImg || "/imgs/user.jpg"}
                alt={user?.fullName}
              />

              {
                canEdit &&
                <EditProfileImageDialog _id={user._id} />
              }
            </div>

            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-muted-foreground">{user?.proffessionalDetails?.companyName}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="my-6">
        <CardHeader>
          <CardTitle className="text-lg">{t("photoGallery")}</CardTitle>
          <CardDescription>{t("photoGalleryDesc")}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {
              user?.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <ImageView
                    index={index}
                    images={user?.images}
                    profileImg={user?.profileImg}
                    setAsProfilePic={setAsProfilePic}
                  />
                  {
                    canEdit &&
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleDeleteImage(image)}
                      disabled={isPending || isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  }
                </div>
              ))
            }

            {
              canEdit && user?.images?.length < MAX_GALLERY_IMAGES &&
              <AddImageDialog _id={user._id} remaining={MAX_GALLERY_IMAGES - user.images.length} />
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileSidebar
