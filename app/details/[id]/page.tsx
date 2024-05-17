"use client";

import { Bookmark, ChevronLeft, Globe, Image, MapPin, ThumbsUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "~/context/hooks";
import {
  likeControllerCreate,
  likeControllerFindOneByUserIdAndStartupId,
  likeControllerRemove,
  startupControllerGetOneById,
} from "~/lib/api";
import { Startup } from "~/lib/schemas";

export default function StartupDetails() {
  const { id: startupId } = useParams();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [startupDetails, setStartupDetails] = useState<Startup | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchStartupbyID() {
    try {
      const { data } = await startupControllerGetOneById(Number(startupId));
      if (data) {
        setStartupDetails(data);
      }
    } catch (error) {
      console.error("Error fetching startup details:", error);
    }
  }

  async function fetchLikeStatus() {
    try {
      const { data } = await likeControllerFindOneByUserIdAndStartupId(
        userId ?? 0,
        Number(startupId)
      ); // Pass userId and startupId with a default value of 0
      if (data) {
        setLiked(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching like status:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStartupbyID();
    if (userId) {
      fetchLikeStatus();
    }
  }, [userId]); // Fetch like status when userId changes

  const handleBookmarked = () => {
    console.log("Bookmarked!");
    setBookmarked(!bookmarked);
  };

  const handleLike = async () => {
    console.log("Liked!");
    setLiked(!liked);
    // try {
    //   if (!userId) {
    //     console.error("User not authenticated.");
    //     return;
    //   }

    //   if (!liked) {
    //     // If not liked, create a new like
    //     await likeControllerCreate({ user: userId, startup: Number(startupId) });
    //     console.log("Liked!");
    //   } else {
    //     // If already liked, remove the like
    //     await likeControllerRemove(userId, Number(startupId));
    //     console.log("Disliked!");
    //   }
    //   setLiked(!liked); // Toggle liked status
    // } catch (error) {
    //   console.error("Error toggling like:", error);
    // }
  };

  // Parse the date string and format it
  const formattedDate = startupDetails?.foundedDate
    ? new Date(startupDetails.foundedDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="absolute left-20 top-0 z-10 h-screen w-[22rem] overflow-y-auto bg-white p-6"
      style={{ padding: 0, margin: 0 }}
    >
      <div className="flex flex-grow items-center justify-center">
        <div className="absolute left-0 top-0 p-2">
          <ChevronLeft size={24} className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <div className="flex h-64 w-full items-center justify-center bg-gray-200">
          {startupDetails?.logoUrl ? (
            <img src={startupDetails.logoUrl} alt={startupDetails.name} />
          ) : (
            <Image size={128} color="#6B7280" />
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="flex items-center justify-between px-6">
          <span className="text-lg font-bold">{startupDetails?.name}</span>
          <ThumbsUp
            size={24}
            onClick={handleLike}
            fill={liked ? "gold" : "none"}
            className={`transform cursor-pointer transition-transform ${liked ? "rotate-12 scale-125" : "rotate-0"}`}
          />
        </div>
        <div className="flex items-center px-6 py-1">
          <MapPin size={24} />
          <span className="ml-2 text-sm">{startupDetails?.locationName}</span>
        </div>
        <div className="flex items-center px-6 py-1">
          <Globe size={16} />
          <a
            href={startupDetails?.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-blue-500 underline hover:text-blue-700"
          >
            {startupDetails?.websiteUrl}
          </a>
        </div>
        <div className="flex justify-center py-4">
          <div className="flex cursor-pointer justify-center py-4" onClick={handleBookmarked}>
            <Bookmark
              size={18}
              onClick={handleBookmarked}
              fill={bookmarked ? "#FFD700" : "none"}
              className={`transform cursor-pointer transition-transform ${bookmarked ? "scale-125" : "scale-100"}`}
            />
            <span className="ml-1 text-sm underline">
              {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
            </span>
          </div>
        </div>
        <hr className="border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto px-6 py-4">
        <div className="mb-1 font-bold">{startupDetails?.founderName}</div>
        <div className="mb-4 text-sm text-gray-300">Founder</div>
        <div className="mb-1 font-bold">{formattedDate}</div>
        <div className="mb-4 text-sm text-gray-300">Established</div>
        <div className="mb-4 text-gray-600">{startupDetails?.description}</div>
        <hr className="mb-4 border-gray-200" />
        <div className="text-gray-600">
          <div className="mb-2">
            <p className="font-bold">Categories:</p>{" "}
            <div className="flex flex-row flex-wrap">
              {startupDetails?.categories.map((category, index) => (
                <span key={index} className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <p className="font-bold">Contact Info:</p> {startupDetails?.contactInfo}
          </div>
          <hr className=" mb-4 border-gray-200" />
          <div className="flex justify-center py-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">4</span>
              <span className="text-sm">Likes</span>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">20</span>
              <span className="text-sm">Bookmarks</span>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">69</span>
              <span className="text-sm">Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
