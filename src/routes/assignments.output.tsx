import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Download, Plus } from "lucide-react";

export const Route = createFileRoute("/assignments/output")({ component: Output });

const shortQs = [
  "Define electroplating. Explain its purpose.",
  "What is the role of a conductor in the process of electrolysis?",
  "Why does a solution of copper sulfate conduct electricity?",
  "Describe one example of the chemical effect of electric current in daily life.",
  "Explain why electric current is said to have chemical effects.",
  "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.",
  "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.",
  "Mention the type of current used in electroplating and justify why it is used.",
  "What is the importance of electric current in the field of metallurgy?",
  "Explain with a chemical equation how copper is deposited during the electroplating of an object.",
];
const diffs = ["Easy","Moderate","Easy","Moderate","Moderate","Challenging","Challenging","Easy","Moderate","Challenging"];

const answers = [
  "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.",
  "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.",
  "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.",
  "An example is the electroplating of silver on jewelry to prevent tarnishing.",
  "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.",
];

function Output() {
  return (
    <AppShell title="Create New">
      <div className="px-8 py-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="text-sm leading-relaxed">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur hover:bg-white/20">
            <Download className="h-3.5 w-3.5" /> Download as PDF
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-border bg-card p-10 shadow-sm">
          <div className="text-center">
            <h1 className="text-xl font-bold">Delhi Public School, Sector-4, Bokaro</h1>
            <p className="mt-2 text-sm">Subject: English</p>
            <p className="text-sm">Class: 5th</p>
          </div>

          <div className="mt-6 flex justify-between text-sm">
            <span>Time Allowed: 45 minutes</span>
            <span>Maximum Marks: 20</span>
          </div>
          <p className="mt-4 text-sm">All questions are compulsory unless stated otherwise.</p>

          <div className="mt-4 text-sm leading-7">
            <p>Name: _______________________</p>
            <p>Roll Number: _______________</p>
            <p>Class: 5th Section: _________</p>
          </div>

          <h2 className="mt-8 text-center font-semibold">Section A</h2>
          <div className="mt-4">
            <h3 className="font-semibold text-sm">Short Answer Questions</h3>
            <p className="text-xs text-muted-foreground italic">Attempt all questions. Each question carries 2 marks</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {shortQs.map((q, i) => (
                <li key={i}>[{diffs[i]}] {q} [2 Marks]</li>
              ))}
            </ol>
            <p className="mt-4 text-sm font-medium">End of Question Paper</p>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-sm">Answer Key:</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {answers.map((a, i) => <li key={i}>{a}</li>)}
              <li>
                Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons:
                <div className="mt-1 pl-2 font-mono text-xs">
                  2H2O + 2e- → H2 + 2OH-<br />
                  Na+ + OH- → NaOH (in solution)
                </div>
              </li>
              <li>
                At the cathode: water is reduced to hydrogen gas and hydroxide ions.<br />
                At the anode: water is oxidized to oxygen gas and hydrogen ions.
              </li>
            </ol>
          </div>
        </div>

        <button className="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg hover:opacity-90">
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </AppShell>
  );
}
