import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  useLandingPageLayout,
  usePlatformSettings,
  useSaveLandingPageLayout,
  useUpdatePlatformSettings,
} from "@/lib/super-admin-hooks";
import {
  cloneLandingLayout,
  DEFAULT_LANDING_LAYOUT,
  LANDING_BLOCK_IDS,
  LANDING_WINDOW_IDS,
  type LandingBlockId,
  type LandingPageLayout,
  type LandingViewport,
  type LandingWindowId,
  type LandingWindowLayout,
} from "@/lib/landing-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  Cloud,
  Globe,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Maximize2,
  Monitor,
  MousePointer2,
  RefreshCw,
  RotateCcw,
  Save,
  Smartphone,
  Wifi,
} from "lucide-react";

const WINDOW_META: Record<LandingWindowId, {
  label: string;
  description: string;
  className: string;
}> = {
  health: {
    label: "School health",
    description: "Speedometer",
    className: "border-violet-300/50 bg-violet-500/15",
  },
  attendance: {
    label: "আজকের উপস্থিতি",
    description: "Attendance chart",
    className: "border-blue-300/50 bg-blue-500/15",
  },
  fee: {
    label: "মাসিক ফি",
    description: "Fee status wheel",
    className: "border-emerald-300/50 bg-emerald-500/15",
  },
  results: {
    label: "পরীক্ষার ফলাফল",
    description: "রাফি · Radar chart",
    className: "border-amber-300/50 bg-amber-500/15",
  },
};

type Interaction = {
  id: LandingWindowId;
  mode: "drag" | "resize";
  startX: number;
  startY: number;
  startWindow: LandingWindowLayout;
};

function updateLayoutWindow(
  layout: LandingPageLayout,
  viewport: LandingViewport,
  id: LandingWindowId,
  patch: Partial<LandingWindowLayout>,
) {
  return {
    ...layout,
    [viewport]: {
      ...layout[viewport],
      [id]: { ...layout[viewport][id], ...patch },
    },
  } as LandingPageLayout;
}

function PreviewCanvas({
  layout,
  viewport,
  selected,
  onSelect,
  onChange,
}: {
  layout: LandingPageLayout;
  viewport: LandingViewport;
  selected: LandingWindowId;
  onSelect: (id: LandingWindowId) => void;
  onChange: (next: LandingPageLayout) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const viewportLayout = layout[viewport];

  useEffect(() => {
    if (!interaction) return;

    const handlePointerMove = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      const deltaX = ((event.clientX - interaction.startX) / bounds.width) * 100;
      const deltaY = ((event.clientY - interaction.startY) / bounds.height) * 100;
      const start = interaction.startWindow;

      if (interaction.mode === "drag") {
        onChange(updateLayoutWindow(layout, viewport, interaction.id, {
          x: Math.min(100 - start.width, Math.max(0, start.x + deltaX)),
          y: Math.min(100 - start.height, Math.max(0, start.y + deltaY)),
        }));
      } else {
        onChange(updateLayoutWindow(layout, viewport, interaction.id, {
          width: Math.min(100 - start.x, Math.max(8, start.width + deltaX)),
          height: Math.min(100 - start.y, Math.max(10, start.height + deltaY)),
        }));
      }
    };

    const stopInteraction = () => setInteraction(null);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopInteraction);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopInteraction);
    };
  }, [interaction, layout, onChange, viewport]);

  const startInteraction = (
    event: ReactPointerEvent<HTMLDivElement>,
    id: LandingWindowId,
    mode: Interaction["mode"],
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
    setInteraction({
      id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startWindow: { ...viewportLayout[id] },
    });
  };

  return (
    <div
      ref={canvasRef}
      className="relative min-h-[430px] flex-1 overflow-hidden rounded-2xl border border-slate-700/80 bg-[#10152d] shadow-inner md:min-h-[480px]"
      style={{ touchAction: "none" }}
      data-testid={`landing-layout-preview-${viewport}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(139,92,246,.24),transparent_32%),linear-gradient(160deg,rgba(30,41,84,.72),rgba(15,23,42,.92))]" />
        <div className="absolute inset-x-[5%] bottom-[4%] h-[42%] rounded-[3rem_3rem_1rem_1rem] border border-white/10 bg-gradient-to-br from-violet-300/10 to-blue-300/10" />
        <div className="absolute left-[8%] top-[12%] h-1 w-1 rounded-full bg-white/70" />
        <div className="absolute left-[55%] top-[21%] h-1.5 w-1.5 rounded-full bg-white/50" />
        <div className="absolute right-[17%] top-[38%] h-1 w-1 rounded-full bg-white/50" />
      </div>

      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
        <MousePointer2 className="h-3.5 w-3.5" />
        Drag to position · resize from corner
      </div>

      {LANDING_WINDOW_IDS.map((id) => {
        const item = viewportLayout[id];
        const meta = WINDOW_META[id];
        const isSelected = selected === id;
        return (
          <div
            key={id}
            role="button"
            tabIndex={0}
            aria-label={`${meta.label} window. Drag to move.`}
            className={`absolute z-20 flex cursor-grab flex-col justify-between overflow-hidden rounded-2xl border p-3 text-white shadow-2xl transition-shadow active:cursor-grabbing ${meta.className} ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#10152d]" : "hover:ring-1 hover:ring-white/60"}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
              minWidth: 74,
              minHeight: 64,
              touchAction: "none",
            }}
            onPointerDown={(event) => startInteraction(event, id, "drag")}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(id);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(id);
              }
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[clamp(.58rem,1.2vw,.75rem)] font-bold">{meta.label}</p>
                <p className="mt-0.5 text-[clamp(.48rem,1vw,.63rem)] text-white/60">{meta.description}</p>
              </div>
              <span className="h-2 w-2 shrink-0 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,.9)]" />
            </div>
            <div className="mt-2 flex flex-1 items-end">
              <div className="h-1.5 w-[72%] rounded-full bg-white/30" />
              <div className="ml-2 h-1.5 w-[18%] rounded-full bg-white/55" />
            </div>
            {id === "attendance" && (
              <div className="absolute bottom-[20%] left-[12%] right-[12%] h-[35%] border-b-2 border-l-2 border-white/35">
                <span className="absolute bottom-[45%] left-[25%] h-1.5 w-1.5 rounded-full bg-white" />
                <span className="absolute bottom-[72%] left-[51%] h-1.5 w-1.5 rounded-full bg-white" />
                <span className="absolute bottom-[36%] right-[10%] h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            )}
            {id === "fee" && (
              <div className="absolute bottom-[16%] left-1/2 h-[42%] w-[40%] -translate-x-1/2 rounded-full border-[7px] border-emerald-200/60 border-r-rose-200/60" />
            )}
            {id === "results" && (
              <div className="absolute bottom-[13%] left-1/2 h-[46%] w-[42%] -translate-x-1/2 rotate-45 border border-amber-100/55" />
            )}
            {isSelected && (
              <div
                role="button"
                tabIndex={0}
                aria-label={`Resize ${meta.label}`}
                className="absolute bottom-0 right-0 flex h-6 w-6 cursor-nwse-resize items-end justify-end rounded-tl-lg bg-white/20 p-1.5"
                onPointerDown={(event) => startInteraction(event, id, "resize")}
                onClick={(event) => event.stopPropagation()}
              >
                <Maximize2 className="h-3 w-3 rotate-90 text-white" />
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] text-white/50">
        {viewport === "desktop" ? "Desktop hero stage" : "Mobile hero stage"}
      </div>
    </div>
  );
}

type ContentForm = {
  heroHeadline: string;
  heroSubtext: string;
  heroCta: string;
  featureHighlight1: string;
  featureHighlight2: string;
  featureHighlight3: string;
  announcementBar: string;
  announcementBarActive: boolean;
};

const EMPTY_FORM: ContentForm = {
  heroHeadline: "",
  heroSubtext: "",
  heroCta: "",
  featureHighlight1: "",
  featureHighlight2: "",
  featureHighlight3: "",
  announcementBar: "",
  announcementBarActive: false,
};

export default function LandingPageMgmt() {
  const { data: settings, isLoading } = usePlatformSettings();
  const update = useUpdatePlatformSettings();
  const {
    data: savedLayout,
    isLoading: isLayoutLoading,
    error: layoutError,
  } = useLandingPageLayout();
  const saveLayout = useSaveLandingPageLayout();
  const { toast } = useToast();
  const [form, setForm] = useState<ContentForm>(EMPTY_FORM);
  const [previewViewport, setPreviewViewport] = useState<LandingViewport>("desktop");
  const [selectedWindow, setSelectedWindow] = useState<LandingWindowId>("attendance");
  const [selectedBlock, setSelectedBlock] = useState<LandingBlockId>("home");
  const [newText, setNewText] = useState("");
  const [layout, setLayout] = useState<LandingPageLayout>(() => cloneLandingLayout(DEFAULT_LANDING_LAYOUT));
  const [layoutDirty, setLayoutDirty] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (settings?.landing) {
      setForm((prev) => ({ ...prev, ...settings.landing }));
    }
  }, [settings]);

  useEffect(() => {
    if (savedLayout && !dirtyRef.current) {
      setLayout(cloneLandingLayout(savedLayout));
    }
  }, [savedLayout]);

  const changeLayout = (next: LandingPageLayout) => {
    dirtyRef.current = true;
    setLayoutDirty(true);
    setLayout(next);
  };

  const resetLayout = () => {
    changeLayout(cloneLandingLayout(DEFAULT_LANDING_LAYOUT));
    toast({ title: "Default layout restored", description: "Save the layout when you are ready to publish it." });
  };

  const handleSaveLayout = async () => {
    try {
      await saveLayout.mutateAsync(layout);
      dirtyRef.current = false;
      setLayoutDirty(false);
      toast({
        title: "Landing layout published",
        description: "The public landing page will update through Firestore realtime sync.",
      });
    } catch {
      toast({
        title: "Could not save layout",
        description: "Check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveContent = async () => {
    try {
      await update.mutateAsync({ landing: form });
      toast({ title: "Landing page settings saved" });
    } catch {
      toast({ title: "Could not save landing settings", variant: "destructive" });
    }
  };

  const selectedLayout = layout[previewViewport][selectedWindow];
  const selectedBlockData = layout.blocks[selectedBlock];
  const updateSelectedNumber = (key: keyof LandingWindowLayout, value: string) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    changeLayout({
      ...layout,
      [previewViewport]: {
        ...layout[previewViewport],
        [selectedWindow]: {
          ...selectedLayout,
          [key]: numericValue,
        },
      },
    });
  };

  const updateBlock = (patch: Partial<typeof selectedBlockData>) => {
    changeLayout({
      ...layout,
      blocks: {
        ...layout.blocks,
        [selectedBlock]: { ...selectedBlockData, ...patch },
      },
    });
  };

  const updateBlockNumber = (
    key: "sensitivity" | "x" | "y" | "width" | "height",
    value: string,
  ) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    updateBlock({ [key]: Math.min(100, Math.max(0, numericValue)) });
  };

  const addCustomText = () => {
    const value = newText.trim();
    if (!value) return;
    updateBlock({ customText: [...selectedBlockData.customText, value].slice(0, 12) });
    setNewText("");
  };

  const field = (key: keyof ContentForm, label: string, multiline = false) => (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {multiline ? (
        <Textarea
          rows={2}
          className="resize-none text-sm"
          value={String(form[key])}
          onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}…`}
        />
      ) : (
        <Input
          className="text-sm"
          value={String(form[key])}
          onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}…`}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Landing Page Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Arrange the live hero windows, verify responsive layouts, and publish the final composition.
        </p>
      </div>

      <Card className="overflow-hidden border-violet-500/20">
        <CardHeader className="border-b border-border/60 bg-violet-500/[0.04] pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-violet-400" />
                Hero window layout editor
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag any window to reposition it. Select a window and pull its bottom-right corner to resize.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-600 dark:text-emerald-300">
                {isLayoutLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wifi className="h-3 w-3" />}
                {isLayoutLoading ? "Connecting…" : layoutError ? "Sync error" : "Realtime connected"}
              </span>
              {layoutDirty && (
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-600 dark:text-amber-300">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-lg border bg-muted/40 p-1">
              <Button
                type="button"
                size="sm"
                variant={previewViewport === "desktop" ? "default" : "ghost"}
                className="gap-2"
                onClick={() => setPreviewViewport("desktop")}
              >
                <Monitor className="h-4 w-4" /> Desktop
              </Button>
              <Button
                type="button"
                size="sm"
                variant={previewViewport === "mobile" ? "default" : "ghost"}
                className="gap-2"
                onClick={() => setPreviewViewport("mobile")}
              >
                <Smartphone className="h-4 w-4" /> Mobile
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={resetLayout}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset defaults
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-2"
                disabled={saveLayout.isPending || !layoutDirty}
                onClick={handleSaveLayout}
              >
                {saveLayout.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
                Save & publish layout
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-5 xl:flex-row">
            <PreviewCanvas
              layout={layout}
              viewport={previewViewport}
              selected={selectedWindow}
              onSelect={setSelectedWindow}
              onChange={changeLayout}
            />
            <div className="w-full shrink-0 space-y-4 rounded-xl border bg-muted/20 p-4 xl:w-64">
              <div>
                <p className="text-sm font-semibold">Window controls</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Editing {previewViewport} view. Values are percentages of the preview stage.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {LANDING_WINDOW_IDS.map((id) => (
                  <Button
                    key={id}
                    type="button"
                    size="sm"
                    variant={selectedWindow === id ? "default" : "outline"}
                    className="justify-start truncate text-xs"
                    onClick={() => setSelectedWindow(id)}
                  >
                    {WINDOW_META[id].label}
                  </Button>
                ))}
              </div>
              <div className="space-y-3 border-t pt-4">
                {([
                  ["x", "Horizontal position"],
                  ["y", "Vertical position"],
                  ["width", "Width"],
                  ["height", "Height"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-xs">{label} (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={Math.round(selectedLayout[key] * 10) / 10}
                      onChange={(event) => updateSelectedNumber(key, event.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Same config on public hero
                </p>
                <p className="mt-1 leading-relaxed">
                  Saving here updates the public landing page without changing authentication or dashboard routes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-indigo-500/20">
        <CardHeader className="border-b border-border/60 bg-indigo-500/[0.04] pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-indigo-400" /> Full landing page builder
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Select any section to edit its text, visibility, position, size, custom copy, and visual sensitivity.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[260px_1fr]">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Page sections</Label>
            <div className="grid gap-1.5">
              {LANDING_BLOCK_IDS.map((id) => {
                const item = layout.blocks[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedBlock(id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition ${selectedBlock === id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/50"}`}
                  >
                    {item.visible ? <Eye className="h-4 w-4 shrink-0" /> : <EyeOff className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.sensitivity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border bg-muted/10 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-lg font-semibold">{selectedBlockData.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">Public section controls</p>
              </div>
              <Button type="button" variant={selectedBlockData.visible ? "outline" : "default"} size="sm" className="gap-2" onClick={() => updateBlock({ visible: !selectedBlockData.visible })}>
                {selectedBlockData.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {selectedBlockData.visible ? "Hide section" : "Show section"}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Section title</Label>
                <Input value={selectedBlockData.title} onChange={(event) => updateBlock({ title: event.target.value })} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Description</Label>
                <Textarea rows={3} className="resize-none" value={selectedBlockData.description} onChange={(event) => updateBlock({ description: event.target.value })} />
              </div>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="landing-sensitivity">Visual sensitivity</Label>
                  <p className="mt-1 text-xs text-muted-foreground">0 = restrained · 100 = vivid glass, contrast, and saturation</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{selectedBlockData.sensitivity}</span>
              </div>
              <input id="landing-sensitivity" type="range" min={0} max={100} step={1} value={selectedBlockData.sensitivity} onChange={(event) => updateBlockNumber("sensitivity", event.target.value)} className="mt-4 w-full accent-[hsl(var(--primary))]" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>Subtle</span><span>Balanced</span><span>Hyper realistic</span></div>
            </div>

            <div>
              <Label>Section position & size (%)</Label>
              <div className="mt-3 grid gap-3 sm:grid-cols-5">
                {([
                  ["x", "Move X"],
                  ["y", "Move Y"],
                  ["width", "Width"],
                  ["height", "Height"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">{label}</Label>
                    <Input type="number" min={0} max={100} step={1} value={selectedBlockData[key]} onChange={(event) => updateBlockNumber(key, event.target.value)} className="h-9" />
                  </div>
                ))}
                <div className="flex items-end">
                  <Button type="button" variant="outline" size="sm" className="w-full gap-1.5" onClick={() => updateBlock({ x: 0, y: 0, width: 100, height: 100 })}>
                    <RefreshCw className="h-3.5 w-3.5" /> Fit
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Additional text blocks</Label>
                <p className="mt-1 text-xs text-muted-foreground">Add supporting copy anywhere in this section. Delete individual lines before publishing.</p>
              </div>
              {selectedBlockData.customText.length > 0 && (
                <div className="space-y-2">
                  {selectedBlockData.customText.map((text, index) => (
                    <div key={`${text}-${index}`} className="flex items-start gap-2 rounded-lg border bg-background/60 p-2">
                      <p className="flex-1 px-1 py-1 text-sm">{text}</p>
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive" onClick={() => updateBlock({ customText: selectedBlockData.customText.filter((_, itemIndex) => itemIndex !== index) })} aria-label={`Delete text block ${index + 1}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input value={newText} onChange={(event) => setNewText(event.target.value)} placeholder="Write a new text block…" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustomText(); } }} />
                <Button type="button" variant="outline" className="shrink-0 gap-1.5" onClick={addCustomText}><Plus className="h-4 w-4" /> Add</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" /></div>
      ) : (
        <div className="max-w-3xl space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4 text-violet-400" /> Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {field("heroHeadline", "Headline")}
              {field("heroSubtext", "Subtext / Description", true)}
              {field("heroCta", "CTA Button Text")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Feature Highlights</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {field("featureHighlight1", "Feature 1")}
              {field("featureHighlight2", "Feature 2")}
              {field("featureHighlight3", "Feature 3")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Announcement Bar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {field("announcementBar", "Announcement Text")}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="announcementActive"
                  checked={!!form.announcementBarActive}
                  onChange={(event) => setForm((prev) => ({ ...prev, announcementBarActive: event.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="announcementActive" className="cursor-pointer text-sm">Show announcement bar on landing page</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSaveContent} disabled={update.isPending} className="gap-2">
              {update.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Content Settings
            </Button>
            <Button variant="outline" onClick={() => setForm(EMPTY_FORM)}>Reset Content</Button>
          </div>
        </div>
      )}
    </div>
  );
}