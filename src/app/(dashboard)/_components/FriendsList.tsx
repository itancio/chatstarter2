import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { CheckIcon, MessageCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export function PendingFriendsList() {
  const friends = useQuery(api.functions.friend.listPending);

  const updateStatus = useMutation(api.functions.friend.updateStatus);
  return (
    <>
      <div className="flex flex-col divide-y">
        <h2 className="text-xs font-medium text-muted-foreground p-2.5">
          Pending Friends
        </h2>
        {friends?.length == 0 && (
          <FriendsListEmpty>No pending friend requests yet</FriendsListEmpty>
        )}
        {friends?.map((friend, index) => (
          <FriendItem
            key={index}
            username={friend.user.username}
            image={friend.user.image}
          >
            <IconButton
              className="bg-green-100"
              title="Accept"
              icon={<CheckIcon />}
              onClick={() =>
                updateStatus({ id: friend._id, status: "accepted" })
              }
            />
            <IconButton
              className="bg-red-100"
              title="Reject"
              icon={<XIcon />}
              onClick={() =>
                updateStatus({ id: friend._id, status: "rejected" })
              }
            />
          </FriendItem>
        ))}
      </div>
    </>
  );
}

export function AcceptedFriendsList() {
  const friends = useQuery(api.functions.friend.listAccepted);
  const updateStatus = useMutation(api.functions.friend.updateStatus);

  const createDirectMessage = useMutation(api.functions.dm.create);
  const router = useRouter();
  const startDirectMessage = async (id: Id<"users">) => {
    try {
      const directMessageId = await createDirectMessage({ username: id });
      router.push(`/dms/${directMessageId}`);
    } catch (error) {
      console.error("Failed to create direct message: ", error);
    }
  };

  return (
    <>
      <div className="flex flex-col divide-y">
        <h2 className="text-xs font-medium text-muted-foreground p-2.5">
          Accepted Friends
        </h2>
        {friends?.length == 0 && (
          <FriendsListEmpty>No friend requests yet</FriendsListEmpty>
        )}
        {friends?.map((friend, index) => (
          <FriendItem
            key={index}
            username={friend.user.username}
            image={friend.user.image}
          >
            <IconButton
              title="Start DM"
              icon={<MessageCircleIcon />}
              onClick={() => startDirectMessage(friend.user._id)}
            />
            <IconButton
              className="bg-red-100"
              title="Remove Friend"
              icon={<XIcon />}
              onClick={() =>
                updateStatus({ id: friend._id, status: "rejected" })
              }
            />
          </FriendItem>
        ))}
      </div>
    </>
  );
}

function FriendsListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function IconButton({
  title,
  className,
  icon,
  onClick,
}: {
  title: string;
  className?: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full", className)}
          variant="outline"
          size="icon"
          onClick={onClick}
        >
          {icon}
          <span className="sr-only">{title}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
}

function FriendItem({
  username,
  image,
  children,
}: {
  username: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 gap-2.5">
      <div className="flex items-center gap-2 5">
        <Avatar className="size-9 border">
          <AvatarImage src={image} />
          <AvatarFallback />
        </Avatar>
        <p className="text-sm font-medium">{username}</p>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}
