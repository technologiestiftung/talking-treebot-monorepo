import { Badge } from "./Badge"

interface ConversationCardProps {
  conversation: {
    id: number
    datetime: string
    language: string
    topic: string | null
    questions: any
    answers: any
  }
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const questions = Array.isArray(conversation.questions)
    ? conversation.questions
    : Object.values(conversation.questions || {})

  const answers = Array.isArray(conversation.answers)
    ? conversation.answers
    : Object.values(conversation.answers || {})

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2">
          {conversation.topic && <Badge>{conversation.topic}</Badge>}
          <Badge variant="secondary">{conversation.language}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">{formatDate(conversation.datetime)}</span>
      </div>

      <div className="space-y-4">
        {questions.map((question: string, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-primary font-semibold text-sm">Q:</span>
              <p className="text-foreground flex-1">{question}</p>
            </div>
            {answers[index] && (
              <div className="flex items-start gap-2 ml-4">
                <span className="text-secondary font-semibold text-sm">A:</span>
                <p className="text-muted-foreground flex-1">{answers[index]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
