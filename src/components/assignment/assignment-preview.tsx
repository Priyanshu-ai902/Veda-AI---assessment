import React from "react";

export function AssignmentPreview({ generatedPaper }: { generatedPaper: any }) {
  if (!generatedPaper) return null;

  return (
    <div className="bg-card p-6 md:p-12 shadow-sm print:shadow-none print:p-0">
      <div className="text-center space-y-1">
        <h1 className="text-lg md:text-2xl font-bold tracking-tight">Delhi Public School, Sector-4, Bokaro</h1>
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wide pt-1">
          <span>Subject: {generatedPaper?.subject || 'N/A'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-border" />
          <span>Class: {generatedPaper?.class || 'N/A'}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-2 border-y border-border py-4 text-xs md:text-sm font-medium">
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">Time Allowed:</span> 45 minutes
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">Maximum Marks:</span> 20
        </span>
      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
        <div className="space-y-3">
          <p className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Candidate Name</span>
            <span className="font-mono border-b border-border pb-1">_______________________</span>
          </p>
          <p className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Roll Number</span>
            <span className="font-mono border-b border-border pb-1">_______________</span>
          </p>
        </div>
        <div className="space-y-3">
          <p className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Class/Section</span>
            <span className="font-mono border-b border-border pb-1">_____ / _________</span>
          </p>
          <p className="flex flex-col gap-1 italic text-muted-foreground text-[10px] pt-1">
            * All questions are compulsory unless stated otherwise.
          </p>
        </div>
      </div>

      <div className="space-y-10 mt-10">
        {generatedPaper?.sections?.map((section: any, idx: number) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand/10 rounded-full hidden md:block" />
            <h2 className="text-center font-bold text-base md:text-xl border-b-2 border-brand/20 pb-2 mb-6 uppercase tracking-wider">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.instruction && (
                <div className="bg-secondary/20 p-3 rounded-lg border border-border/50">
                  <p className="text-[11px] md:text-xs text-muted-foreground italic font-medium leading-relaxed">
                    <span className="text-brand not-italic font-bold mr-2 uppercase tracking-tighter">Instructions:</span>
                    {section.instruction}
                  </p>
                </div>
              )}
              <ol className="list-decimal space-y-8 pl-5 md:pl-6">
                {section.questions?.map((q: any, qIdx: number) => (
                  <li key={qIdx} className="text-sm md:text-base leading-relaxed pl-2">
                    <div className="flex flex-col gap-3">
                      <p className="font-medium text-foreground/90">{q.question}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          q.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-full border border-border/50">
                          {q.marks} Marks
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 pt-8 border-t-2 border-dashed border-border text-center">
        <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">End of Question Paper</p>
      </div>
    </div>
  );
}
