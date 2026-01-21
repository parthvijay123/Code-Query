import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Question {
    $id: string;
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId?: string;
    $createdAt: string;
}

interface QuestionCardProps {
    question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
    return (
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <Link href={`/questions/${question.$id}`} className="text-xl font-semibold text-primary hover:underline">
                    {question.title}
                </Link>
                <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(question.$createdAt).toLocaleDateString()}
                </span>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">
                {question.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                    </Badge>
                ))}
            </div>

            <div className="flex items-center text-sm text-muted-foreground gap-4">
                {/* Placeholder for votes and answers count if we had them aggregated or indexed */}
                {/* <span>0 votes</span> */}
                {/* <span>0 answers</span> */}

                <div className="flex items-center gap-2 ml-auto">
                    {/* We could fetch author name if we expanded the authorId, or just show ID for now */}
                    <span>User: {question.authorId}</span>
                </div>
            </div>
        </div>
    );
}
