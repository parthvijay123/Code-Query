import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getQuestions } from "@/models/server/question.actions";
import QuestionCard from "@/components/QuestionCard";

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ search?: string, tag?: string }> }) {
    const { search, tag } = await searchParams;

    const { documents: questions, error } = await getQuestions({ search, tag });


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">All Questions</h1>
                <Link href="/questions/ask">
                    <Button>Ask Question</Button>
                </Link>
            </div>

            {error && (
                <div className="p-4 border border-red-200 bg-red-50 text-red-500 rounded-md mb-6">
                    Error loading questions: {error}
                </div>
            )}

            {questions && questions.length > 0 ? (
                <div className="space-y-4">
                    {questions.map((question: any) => (
                        <QuestionCard key={question.$id} question={question} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground border rounded-lg border-dashed">
                    No questions found. Be the first to ask one!
                </div>
            )}
        </div>
    );
}
