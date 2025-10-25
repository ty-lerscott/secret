'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, RefreshCcw, Check, Zap, History, Download } from "lucide-react";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

import {
  guid,
  cuid2,
  uuidV4,
  unicodeUID,
  uuidVersionless,
} from '@/app/lib/utils'

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function IDForge() {
  const [scheme, setScheme] = useState("uuid");
  const [current, setCurrent] = useState("");
  const [auto, setAuto] = useState(true);
  const [count, setCount] = useState("1");
  const [historyItems, setHistoryItems] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const outRef = useRef<HTMLInputElement>(null);

  const generator = useMemo(() => {
    switch (scheme) {
      case "guid":
        return () => guid().toString();
      case "uuid_wild":
        return () => uuidVersionless();
      case "cuid2":
        return () => cuid2();
      case "unicode_uid":
        return () => unicodeUID();
      case "uuid":
      default:
        return () => uuidV4();
    }
  }, [scheme]);

  const generate = (n = 1) => {
    const items = Array.from({ length: n }, () => generator());
    setCurrent(items[0]);
    setHistoryItems(prev => [...items, ...prev].slice(0, 100));
    return items;
  };

  useEffect(() => {
    if (auto && !current) generate(1);
  }, [auto, scheme]);

  const handleCopy = async () => {
    if (!current) return;
    await navigator.clipboard.writeText(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleBulk = () => {
    const n = Math.min(Math.max(parseInt(count || "1", 10), 1), 1000);
    const items = generate(n);
    downloadText(`${scheme}-list-${n}.txt`, items.join("\n"));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">ID Forge</h1>
          <p className="mt-2 text-slate-300">Generate various unique identifiers—<span className="font-medium">UUID v4</span>, <span className="font-medium">GUID</span>, <span className="font-medium">UUID v* (versionless)</span>, <span className="font-medium">CUID2-like</span>, and even <span className="font-medium">Unicode UIDs</span>.</p>
        </header>

        <Card className="bg-slate-950/60 border-slate-800 shadow-xl backdrop-blur">
          <CardHeader className="gap-2">
            <CardTitle className="text-xl flex items-center justify-between">
              <span>Generator</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch id="auto" checked={auto} onCheckedChange={setAuto} />
                  <Label htmlFor="auto" className="text-sm text-slate-300">Auto-generate on load</Label>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2">
                <Label className="text-slate-300 mb-1 block">Identifier</Label>
                <div className="flex gap-2">
                  <Input ref={outRef} readOnly value={current} className="font-mono text-base md:text-lg bg-slate-900/80 border-slate-800 text-white" />
                  <Button variant="secondary" onClick={handleCopy} className="shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button onClick={() => generate(1)} className="shrink-0">
                    <RefreshCcw className="h-4 w-4 mr-2" /> New
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Scheme</Label>
                <Select value={scheme} onValueChange={setScheme}>
                  <SelectTrigger className="bg-slate-900/80 border-slate-800 text-white">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="uuid">UUID v4</SelectItem>
                    <SelectItem value="guid">GUID</SelectItem>
                    <SelectItem value="uuid_wild">UUID v* (versionless)</SelectItem>
                    <SelectItem value="cuid2">CUID2-like</SelectItem>
                    <SelectItem value="unicode_uid">Unicode UID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-slate-300">Bulk</Label>
              <Input value={count} onChange={e => setCount(e.target.value)} className="w-20 bg-slate-900/80 border-slate-800 text-white" inputMode="numeric" />
              <Button variant="outline" onClick={handleBulk} className="border-slate-700">
                <Download className="h-4 w-4 mr-2" /> Download List
              </Button>
              <div className="text-xs text-slate-400">1–1000, saves as .txt</div>
            </div>

            <Tabs defaultValue="history" className="w-full">
              <TabsList className="bg-slate-900/60 text-white">
                <TabsTrigger value="history" className="flex items-center gap-2 text-white">
                  <History className="h-4 w-4" /> History
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 text-white">
                  <Zap className="h-4 w-4" /> About
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-3">
                {historyItems.length === 0 ? (
                  <p className="text-slate-400">No IDs yet. Generate one to get started.</p>
                ) : (
                  <ul className="space-y-2 max-h-60 overflow-auto pr-1">
                    {historyItems.map((h, i) => (
                      <li key={`${h}-${i}`} className="font-mono text-sm bg-slate-900/70 border border-slate-800 rounded-md px-3 py-2 break-all text-white">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              <TabsContent value="about" className="mt-3 text-sm text-slate-300 leading-relaxed">
                <p className="mb-3">Everything runs entirely in your browser. No secrets needed, nothing sent to a server.</p>
                <p className="mb-3"><span className="font-medium">UUID v* (versionless)</span> replaces the fixed version nibble with a random hex digit—nonstandard, but still RFC-shaped.</p>
                <p className="mb-3"><span className="font-medium">Unicode UID</span> uses random symbols from Greek, Cyrillic, Japanese, and emoji blocks. Unique, expressive, and fun.</p>
                <p>Tip: Treat identifiers as public. If you ever embed secrets, keep them server-side.</p>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="justify-between text-xs text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">N</kbd> to generate a new ID</span>
            <span>Theme: Midnight Slate</span>
          </CardFooter>
        </Card>

        <footer className="mt-8 text-center text-slate-500 text-xs">
          <p>Built to illustrate the difference between public IDs and private secrets.</p>
        </footer>
      </div>

      <Keybind onKey="n" cb={() => generate(1)} />
    </div>
  );
}

function Keybind({ onKey, cb }: { onKey: string; cb: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === onKey.toLowerCase()) {
        e.preventDefault();
        cb();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey, cb]);
  return null;
}
