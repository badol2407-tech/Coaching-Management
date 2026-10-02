import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, Monitor, Move, MousePointer2, Plus, RotateCcw, Save, Smartphone, Tag, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  DEFAULT_PUBLIC_PRICING_CONFIG,
  DEFAULT_PRICING_LAYOUT,
  normalizePublicPricingConfig,
  type PricingViewport,
  type PublicPricingConfig,
} from "@/lib/pricing-config";
import {
  usePricingConfig,
  useSavePricingConfig,
} from "@/lib/super-admin-hooks";
import type { PlanTier } from "@/lib/plan-config";

const PLAN_ORDER: PlanTier[] = [
  "free_trial",
  "founder_launch",
  "annual_premium",
];

const PLAN_LABELS: Record<PlanTier, string> = {
  free_trial: "Free Trial",
  founder_launch: "Founder Launch",
  annual_premium: "Annual Premium",
};

export default function PricingBuilder() {
  const { data: savedConfig, isLoading } = usePricingConfig();
  const savePricingConfig = useSavePricingConfig();

  const [viewport, setViewport] = useState<PricingViewport>("desktop");
  const [isWindowMode, setIsWindowMode] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PlanTier>("free_trial");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elementInteraction, setElementInteraction] = useState<{
    id: string;
    mode: "drag" | "resize";
    startX: number;
    startY: number;
    startElement: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  } | null>(null);

  const [interaction, setInteraction] = useState<{
    tier: PlanTier;
    mode: "drag" | "resize";
    startX: number;
    startY: number;
    startItem: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const draggedRef = useRef(false);
  const [config, setConfig] = useState<PublicPricingConfig>(
    DEFAULT_PUBLIC_PRICING_CONFIG,
  );

  useEffect(() => {
    if (savedConfig) {
      setConfig(normalizePublicPricingConfig(savedConfig));
    }
  }, [savedConfig]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const windowMode = params.get("window") === "1";

    setIsWindowMode(windowMode);

    if (!windowMode) return;

    const maximizeWindow = () => {
      try {
        window.moveTo(0, 0);
        window.resizeTo(
          window.screen.availWidth,
          window.screen.availHeight,
        );
      } catch {
        // Browser may restrict programmatic window resizing.
      }
    };

    maximizeWindow();

    const timer = window.setTimeout(maximizeWindow, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const layout = config.layout;
  const selectedItem = layout[viewport][selectedTier];
  const selectedPlan = config.plans[selectedTier];

  const selectedElement =
    config.elements[viewport][selectedTier].find(
      (element) => element.id === selectedElementId,
    ) ?? null;
  const updateSelectedElement = (
    patch: Partial<
      PublicPricingConfig["elements"]["desktop"][PlanTier][number]
    >,
  ) => {
    if (!selectedElementId) return;

    setConfig((current) => ({
      ...current,
      elements: {
        ...current.elements,
        [viewport]: {
          ...current.elements[viewport],
          [selectedTier]: current.elements[viewport][selectedTier].map(
            (element) =>
              element.id === selectedElementId
                ? { ...element, ...patch }
                : element,
          ),
        },
      },
    }));
  };

  const addElement = (
    type: "text" | "price" | "feature" | "button",
  ) => {
    const defaults = {
      text: {
        content: "নতুন Text",
        width: 60,
        height: 8,
      },
      price: {
        content: String(selectedPlan.price),
        width: 60,
        height: 10,
      },
      feature: {
        content: "নতুন Feature",
        width: 80,
        height: 7,
      },
      button: {
        content: "Button",
        width: 50,
        height: 9,
      },
    }[type];

    const element = {
      id: `${viewport}-${selectedTier}-${type}-${Date.now()}`,
      type,
      tier: selectedTier,
      content: defaults.content,
      x: 10,
      y: Math.min(
        90,
        10 + config.elements[viewport][selectedTier].length * 8,
      ),
      width: defaults.width,
      height: defaults.height,
      visible: true,
    };

    setConfig((current) => ({
      ...current,
      elements: {
        ...current.elements,
        [viewport]: {
          ...current.elements[viewport],
          [selectedTier]: [
            ...current.elements[viewport][selectedTier],
            element,
          ],
        },
      },
    }));

    setSelectedElementId(element.id);
  };

  const removeSelectedElement = () => {
    if (!selectedElementId) return;

    setConfig((current) => ({
      ...current,
      elements: {
        ...current.elements,
        [viewport]: {
          ...current.elements[viewport],
          [selectedTier]: current.elements[viewport][selectedTier].filter(
            (element) => element.id !== selectedElementId,
          ),
        },
      },
    }));

    setSelectedElementId(null);
  };


  const canvasHeight = viewport === "desktop" ? 520 : 760;

  const updateSelected = (
    key: "x" | "y" | "width" | "height",
    value: number,
  ) => {
    setConfig((current) => ({
      ...current,
      layout: {
        ...current.layout,
        [viewport]: {
          ...current.layout[viewport],
          [selectedTier]: {
            ...current.layout[viewport][selectedTier],
            [key]: value,
          },
        },
      },
    }));
  };

  const updateSelectedPlan = (
    key:
      | "name"
      | "price"
      | "tagline"
      | "badge"
      | "regularPrice"
      | "savings"
      | "annualBenefit"
      | "spotsLeft",
    value: string,
  ) => {
    setConfig((current) => {
      const currentPlan = current.plans[selectedTier];

      let nextValue: string | number = value;

      if (
        key === "price" ||
        key === "regularPrice"
      ) {
        nextValue = value === "" ? 0 : Number(value);
      }

      return {
        ...current,
        plans: {
          ...current.plans,
          [selectedTier]: {
            ...currentPlan,
            [key]: nextValue,
          },
        },
      };
    });
  };

  const updateSelectedFeature = (index: number, value: string) => {
    setConfig((current) => {
      const currentPlan = current.plans[selectedTier];
      const displayHighlights = [...currentPlan.displayHighlights];

      displayHighlights[index] = value;

      return {
        ...current,
        plans: {
          ...current.plans,
          [selectedTier]: {
            ...currentPlan,
            displayHighlights,
          },
        },
      };
    });
  };

  const addSelectedFeature = () => {
    setConfig((current) => {
      const currentPlan = current.plans[selectedTier];

      return {
        ...current,
        plans: {
          ...current.plans,
          [selectedTier]: {
            ...currentPlan,
            displayHighlights: [
              ...currentPlan.displayHighlights,
              "নতুন feature",
            ],
          },
        },
      };
    });
  };

  const removeSelectedFeature = (index: number) => {
    setConfig((current) => {
      const currentPlan = current.plans[selectedTier];

      return {
        ...current,
        plans: {
          ...current.plans,
          [selectedTier]: {
            ...currentPlan,
            displayHighlights: currentPlan.displayHighlights.filter(
              (_, featureIndex) => featureIndex !== index,
            ),
          },
        },
      };
    });
  };

  const resetLayout = () => {
    setConfig(normalizePublicPricingConfig(DEFAULT_PUBLIC_PRICING_CONFIG));
  };

  const handleSave = async () => {
    console.log("[PricingBuilder] SAVE CLICKED", {
      founderPrice: config.plans.founder_launch.price,
      isPending: savePricingConfig.isPending,
      isLoading,
    });

    try {
      await savePricingConfig.mutateAsync(config);

      console.log("[PricingBuilder] SAVE SUCCESS", {
        founderPrice: config.plans.founder_launch.price,
      });
    } catch (error) {
      console.error("[PricingBuilder] SAVE FAILED", error);
    }
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interaction || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((event.clientX - interaction.startX) / rect.width) * 100;
    const dy = ((event.clientY - interaction.startY) / rect.height) * 100;

    if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
      draggedRef.current = true;
    }

    const start = interaction.startItem;

    setConfig((current) => {
      const currentItem = current.layout[viewport][interaction.tier];

      if (interaction.mode === "drag") {
        const maxX = 100 - start.width;
        const maxY = 100 - start.height;

        return {
          ...current,
          layout: {
            ...current.layout,
            [viewport]: {
              ...current.layout[viewport],
              [interaction.tier]: {
                ...currentItem,
                x: Number(clamp(start.x + dx, 0, maxX).toFixed(2)),
                y: Number(clamp(start.y + dy, 0, maxY).toFixed(2)),
              },
            },
          },
        };
      }

      const maxWidth = 100 - start.x;
      const maxHeight = 100 - start.y;

      return {
        ...current,
        layout: {
          ...current.layout,
          [viewport]: {
            ...current.layout[viewport],
            [interaction.tier]: {
              ...currentItem,
              width: Number(clamp(start.width + dx, 12, maxWidth).toFixed(2)),
              height: Number(clamp(start.height + dy, 15, maxHeight).toFixed(2)),
            },
          },
        },
      };
    });
  };

  const handleElementPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!elementInteraction || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const dx =
      ((event.clientX - elementInteraction.startX) / rect.width) * 100;

    const dy =
      ((event.clientY - elementInteraction.startY) / rect.height) * 100;

    const start = elementInteraction.startElement;

    setConfig((current) => ({
      ...current,
      elements: {
        ...current.elements,
        [viewport]: {
          ...current.elements[viewport],
          [selectedTier]: current.elements[viewport][selectedTier].map(
            (element) => {
              if (element.id !== elementInteraction.id) {
                return element;
              }

              if (elementInteraction.mode === "drag") {
                return {
                  ...element,
                  x: Number(
                    clamp(
                      start.x + dx,
                      0,
                      100 - start.width,
                    ).toFixed(2),
                  ),
                  y: Number(
                    clamp(
                      start.y + dy,
                      0,
                      100 - start.height,
                    ).toFixed(2),
                  ),
                };
              }

              return {
                ...element,
                width: Number(
                  clamp(
                    start.width + dx,
                    5,
                    100 - start.x,
                  ).toFixed(2),
                ),
                height: Number(
                  clamp(
                    start.height + dy,
                    5,
                    100 - start.y,
                  ).toFixed(2),
                ),
              };
            },
          ),
        },
      },
    }));
  };

  const handleElementPointerUp = () => {
    setElementInteraction(null);
  };

  const beginElementInteraction = (
    event: React.PointerEvent<HTMLDivElement>,
    element: PublicPricingConfig["elements"]["desktop"][PlanTier][number],
    mode: "drag" | "resize",
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedTier(element.tier);
    setSelectedElementId(element.id);

    setElementInteraction({
      id: element.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startElement: {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      },
    });
  };

  const handlePointerUp = () => {
    setInteraction(null);
    setElementInteraction(null);

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "";
    }
  };

  const beginInteraction = (
    event: React.PointerEvent<HTMLDivElement>,
    tier: PlanTier,
    mode: "drag" | "resize",
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const item = layout[viewport][tier];

    setSelectedTier(tier);
    draggedRef.current = false;

    setInteraction({
      tier,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startItem: { ...item },
    });

    if (canvasRef.current) {
      canvasRef.current.style.cursor = mode === "drag" ? "grabbing" : "nwse-resize";
    }
  };

  const cards = useMemo(
    () =>
      PLAN_ORDER.map((tier) => ({
        tier,
        plan: config.plans[tier],
        item: layout[viewport][tier],
      })),
    [config.plans, layout, viewport],
  );

  return (
    <div className="min-h-full space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build and arrange the public pricing section visually.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={viewport === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewport("desktop")}
          >
            <Monitor className="mr-2 h-4 w-4" />
            Desktop
          </Button>

          <Button
            variant={viewport === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewport("mobile")}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile
          </Button>

          <Button variant="outline" size="sm" onClick={resetLayout}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          {!isWindowMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const width = window.screen.availWidth;
                const height = window.screen.availHeight;

                const editorWindow = window.open(
                  `${window.location.origin}/billing/pricing-builder?window=1`,
                  "edutrack-pricing-builder",
                  [
                    `width=${width}`,
                    `height=${height}`,
                    "left=0",
                    "top=0",
                    "resizable=yes",
                    "scrollbars=yes",
                  ].join(","),
                );

                if (editorWindow) {
                  editorWindow.focus();
                }
              }}
              title="Open editor in a new window"
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              Maximize
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || savePricingConfig.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {savePricingConfig.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div
        className={
          isWindowMode
            ? "grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[220px_minmax(0,1fr)_280px]"
            : "grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_280px]"
        }
      >
        {/* Elements */}
        <Card className="h-fit p-4">
          <div className="mb-4">
            <h2 className="font-semibold">Elements</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Add elements to the selected plan
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement("text")}
            >
              <Type className="mr-2 h-4 w-4" />
              Text
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement("price")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Price
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement("feature")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Feature
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement("button")}
            >
              <Move className="mr-2 h-4 w-4" />
              Button
            </Button>
          </div>
        </Card>

        {/* Canvas */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-medium">Pricing Canvas</p>
              <p className="text-xs text-muted-foreground">
                {viewport === "desktop" ? "Desktop layout" : "Mobile layout"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MousePointer2 className="h-4 w-4" />
              Select a card
            </div>
          </div>

          <div className="overflow-auto bg-muted/30 p-6">
            <div
              className="relative mx-auto w-full max-w-[1100px] rounded-xl border bg-background shadow-sm"
              style={{ height: canvasHeight }}
            >
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]" />

              <div
                ref={canvasRef}
                className="absolute inset-0"
                onPointerMove={(event) => {
                  if (elementInteraction) {
                    handleElementPointerMove(event);
                  } else if (interaction) {
                    handlePointerMove(event);
                  }
                }}
                onPointerUp={() => {
                  if (elementInteraction) {
                    handleElementPointerUp();
                  }
                  handlePointerUp();
                }}
                onPointerCancel={() => {
                  if (elementInteraction) {
                    handleElementPointerUp();
                  }
                  handlePointerUp();
                }}
                onPointerLeave={(event) => {
                  if (elementInteraction) {
                    handleElementPointerMove(event);
                  } else if (interaction) {
                    handlePointerMove(event);
                  }
                }}
              >
                {cards.map(({ tier, plan, item }) => {
                  const selected = tier === selectedTier;

                  return (
                    <div
                      key={tier}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(event) =>
                        beginInteraction(event, tier, "drag")
                      }
                      onClick={() => {
                        if (!draggedRef.current) setSelectedTier(tier);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedTier(tier);
                        }
                      }}
                      className={[
                        "absolute overflow-hidden rounded-2xl border-2 bg-background/95 p-5 text-left shadow-sm",
                        "select-none touch-none",
                        selected
                          ? "border-primary shadow-lg ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50",
                      ].join(" ")}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${item.width}%`,
                        height: `${item.height}%`,
                      }}
                    >
                      <div className="absolute inset-0">
                        {config.elements[viewport][tier]
                          .filter((element) => element.visible)
                          .map((element) => {
                            const isSelected =
                              selectedElementId === element.id;

                            return (
                              <div
                                key={element.id}
                                role="button"
                                tabIndex={0}
                                onPointerDown={(event) => {
                                  beginElementInteraction(
                                    event,
                                    element,
                                    "drag",
                                  );
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedTier(tier);
                                  setSelectedElementId(element.id);
                                }}
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setSelectedTier(tier);
                                    setSelectedElementId(element.id);
                                  }
                                }}
                                className={`absolute rounded-md ${
                                  isSelected
                                    ? "ring-2 ring-primary ring-offset-1"
                                    : "ring-1 ring-transparent hover:ring-primary/40"
                                }`}
                                style={{
                                  left: `${element.x}%`,
                                  top: `${element.y}%`,
                                  width: `${element.width}%`,
                                  height: `${element.height}%`,
                                }}
                              >
                                <div className="flex h-full w-full items-center overflow-hidden px-2 text-xs">
                                  {element.type === "price" ? (
                                    <span className="font-bold">
                                      ৳{Number(
                                        element.content || 0,
                                      ).toLocaleString("en-US")}
                                    </span>
                                  ) : element.type === "button" ? (
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="pointer-events-none h-full w-full"
                                    >
                                      {element.content}
                                    </Button>
                                  ) : element.type === "feature" ? (
                                    <span className="truncate">
                                      ✓ {element.content}
                                    </span>
                                  ) : (
                                    <span className="truncate">
                                      {element.content}
                                    </span>
                                  )}
                                </div>

                                {isSelected && (
                                  <div
                                    role="presentation"
                                    onPointerDown={(event) => {
                                      beginElementInteraction(
                                        event,
                                        element,
                                        "resize",
                                      );
                                    }}
                                    className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize rounded-sm border border-primary bg-background shadow-sm"
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>

                      {selected && (
                        <div
                          role="presentation"
                          onPointerDown={(event) =>
                            beginInteraction(event, tier, "resize")
                          }
                          className="absolute bottom-1 right-1 h-4 w-4 cursor-nwse-resize rounded-sm border border-primary bg-background shadow-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Properties */}
        <Card className="h-fit max-h-[760px] overflow-y-auto p-4">
          <div className="mb-4">
            <h2 className="font-semibold">Properties</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Edit the selected pricing card.
            </p>
          </div>

          <div className="space-y-5">
            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Edit selected element
                  </p>
                  <div className="mt-2 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                    <span className="text-sm font-medium capitalize">
                      {selectedElement.type}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeSelectedElement}
                      title="Delete element"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pricing-element-content">
                    Content
                  </Label>
                  <Input
                    id="pricing-element-content"
                    className="mt-1"
                    value={selectedElement.content}
                    onChange={(event) =>
                      updateSelectedElement({
                        content: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pricing-element-x">X (%)</Label>
                    <Input
                      id="pricing-element-x"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      className="mt-1"
                      value={selectedElement.x}
                      onChange={(event) =>
                        updateSelectedElement({
                          x: Number(event.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricing-element-y">Y (%)</Label>
                    <Input
                      id="pricing-element-y"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      className="mt-1"
                      value={selectedElement.y}
                      onChange={(event) =>
                        updateSelectedElement({
                          y: Number(event.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricing-element-width">
                      Width (%)
                    </Label>
                    <Input
                      id="pricing-element-width"
                      type="number"
                      min="1"
                      max="100"
                      step="0.5"
                      className="mt-1"
                      value={selectedElement.width}
                      onChange={(event) =>
                        updateSelectedElement({
                          width: Number(event.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricing-element-height">
                      Height (%)
                    </Label>
                    <Input
                      id="pricing-element-height"
                      type="number"
                      min="1"
                      max="100"
                      step="0.5"
                      className="mt-1"
                      value={selectedElement.height}
                      onChange={(event) =>
                        updateSelectedElement({
                          height: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    updateSelectedElement({
                      visible: !selectedElement.visible,
                    })
                  }
                >
                  {selectedElement.visible ? "Hide element" : "Show element"}
                </Button>
              </div>
            ) : null}

            <div>
              <Label className="text-xs">Plan</Label>
              <div className="mt-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm font-medium">
                {PLAN_LABELS[selectedTier]}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Content
              </p>

              <div>
                <Label htmlFor="pricing-plan-name">Name</Label>
                <Input
                  id="pricing-plan-name"
                  className="mt-1"
                  value={selectedPlan.name}
                  onChange={(event) =>
                    updateSelectedPlan("name", event.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="pricing-plan-price">Price</Label>
                <Input
                  id="pricing-plan-price"
                  type="number"
                  min="0"
                  className="mt-1"
                  value={selectedPlan.price}
                  onChange={(event) =>
                    updateSelectedPlan("price", event.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="pricing-plan-tagline">Tagline</Label>
                <Input
                  id="pricing-plan-tagline"
                  className="mt-1"
                  value={selectedPlan.tagline}
                  onChange={(event) =>
                    updateSelectedPlan("tagline", event.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="pricing-plan-badge">Badge</Label>
                <Input
                  id="pricing-plan-badge"
                  className="mt-1"
                  placeholder="Optional"
                  value={selectedPlan.badge ?? ""}
                  onChange={(event) =>
                    updateSelectedPlan("badge", event.target.value)
                  }
                />
              </div>

              {selectedPlan.billingCycle === "monthly" && (
                <>
                  <div>
                    <Label htmlFor="pricing-plan-regular-price">
                      Regular Price
                    </Label>
                    <Input
                      id="pricing-plan-regular-price"
                      type="number"
                      min="0"
                      className="mt-1"
                      value={selectedPlan.regularPrice ?? ""}
                      onChange={(event) =>
                        updateSelectedPlan(
                          "regularPrice",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricing-plan-savings">Savings</Label>
                    <Input
                      id="pricing-plan-savings"
                      className="mt-1"
                      value={selectedPlan.savings ?? ""}
                      onChange={(event) =>
                        updateSelectedPlan("savings", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricing-plan-spots-left">
                      Spots Left Text
                    </Label>
                    <Input
                      id="pricing-plan-spots-left"
                      className="mt-1"
                      value={selectedPlan.spotsLeft ?? ""}
                      onChange={(event) =>
                        updateSelectedPlan("spotsLeft", event.target.value)
                      }
                    />
                  </div>
                </>
              )}

              {selectedPlan.billingCycle === "annual" && (
                <div>
                  <Label htmlFor="pricing-plan-annual-benefit">
                    Annual Benefit
                  </Label>
                  <Input
                    id="pricing-plan-annual-benefit"
                    className="mt-1"
                    value={selectedPlan.annualBenefit ?? ""}
                    onChange={(event) =>
                      updateSelectedPlan(
                        "annualBenefit",
                        event.target.value,
                      )
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Features
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSelectedFeature}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {selectedPlan.displayHighlights.map((feature, index) => (
                  <div key={`${selectedTier}-feature-${index}`} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(event) =>
                        updateSelectedFeature(index, event.target.value)
                      }
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSelectedFeature(index)}
                      aria-label={`Remove feature ${index + 1}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Position & Size
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pricing-x">X</Label>
                  <Input
                    id="pricing-x"
                    type="number"
                    value={selectedItem.x}
                    onChange={(event) =>
                      updateSelected("x", Number(event.target.value))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="pricing-y">Y</Label>
                  <Input
                    id="pricing-y"
                    type="number"
                    value={selectedItem.y}
                    onChange={(event) =>
                      updateSelected("y", Number(event.target.value))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="pricing-width">Width</Label>
                  <Input
                    id="pricing-width"
                    type="number"
                    value={selectedItem.width}
                    onChange={(event) =>
                      updateSelected("width", Number(event.target.value))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="pricing-height">Height</Label>
                  <Input
                    id="pricing-height"
                    type="number"
                    value={selectedItem.height}
                    onChange={(event) =>
                      updateSelected("height", Number(event.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
