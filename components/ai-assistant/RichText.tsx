'use client'

function InlineBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function RichText({ text }: { text: string }) {
  // Split into paragraphs by double newline
  const paragraphs = text.split(/\n\n/)

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n')

        // Check if this paragraph is a bullet list
        const isBulletList = lines.every(
          (l) => l.trim().startsWith('- ') || l.trim() === ''
        )

        if (isBulletList) {
          const items = lines
            .map((l) => l.trim())
            .filter((l) => l.startsWith('- '))
            .map((l) => l.slice(2))
          return (
            <ul key={pi} className="space-y-1 ml-0.5">
              {items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2">
                  <span className="text-gray-400 dark:text-slate-500 mt-[3px] shrink-0">•</span>
                  <span><InlineBold text={item} /></span>
                </li>
              ))}
            </ul>
          )
        }

        // Regular paragraph — render lines with <br>
        return (
          <p key={pi}>
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <InlineBold text={line} />
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
