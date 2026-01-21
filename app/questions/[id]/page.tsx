import { getQuestion } from "@/models/server/question.actions";
import { getAnswers } from "@/models/server/answer.actions";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnswerForm from "@/components/AnswerForm";
import VoteButtons from "@/components/VoteButtons";

import Comments from "@/components/Comments";

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { question, error } = await getQuestion(id);
    const { documents: answers, error: answersError } = await getAnswers(id);

    if (error || !question) {
        return (
            <div className="container mx-auto py-10 text-center text-red-500">
                {error || "Question not found"}
            </div>
        );
    }

    // Attachment logic disabled during migration
    const attachmentUrl = null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{question.title}</h1>
                <div className="flex gap-2 text-sm text-muted-foreground mb-4">
                    <span>Asked {new Date(question.$createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Author: {question.authorId}</span>
                </div>

                <div className="flex gap-2 mb-8">
                    {question.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mb-8 border-b pb-8">
                <VoteButtons type="question" typeId={question.$id} />
                <div className="prose dark:prose-invert max-w-none w-full">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {question.content}
                    </ReactMarkdown>

                    {attachmentUrl && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-2">Attachment</h3>
                            <img src={attachmentUrl} alt="Attachment" className="max-w-full rounded-md border" />
                        </div>
                    )}

                    <Comments type="question" typeId={question.$id} />
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold">{answers?.length || 0} Answers</h2>

                {answers && answers.map((answer: any) => (
                    <div key={answer.$id} className="border-b pb-6 flex gap-4">
                        <VoteButtons type="answer" typeId={answer.$id} />
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                                <span>Author: {answer.authorId}</span>
                                <span>{new Date(answer.$createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="prose dark:prose-invert max-w-none mb-4">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {answer.content}
                                </ReactMarkdown>
                            </div>
                            <Comments type="answer" typeId={answer.$id} />
                        </div>
                    </div>
                ))}

                <AnswerForm questionId={question.$id} />
            </div>
        </div>
    );
}
