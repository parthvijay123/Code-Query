import { getComments } from "@/models/server/comment.actions";
import CommentForm from "./CommentForm";
import { Models } from "appwrite";

export default async function Comments({
    type,
    typeId
}: {
    type: "question" | "answer",
    typeId: string
}) {
    const { documents: comments } = await getComments(type, typeId);

    return (
        <div className="mt-4 space-y-2">
            {comments && comments.map((comment: any) => (
                <div key={comment.$id} className="text-sm border-b pb-1">
                    <span className="text-muted-foreground">{comment.content}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                        – {comment.authorId} {new Date(comment.$createdAt).toLocaleDateString()}
                    </span>
                </div>
            ))}

            <CommentForm type={type} typeId={typeId} />
        </div>
    );
}
