"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { type BundledLanguage, codeToHtml, type ShikiTransformer } from "shiki";

const codeBlockVariants = cva(
  "group/code-block relative w-full overflow-hidden rounded-lg bg-card text-card-foreground edge",
  {
    variants: {},
    defaultVariants: {},
  }
);

type CodeBlockProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof codeBlockVariants> & {
    code: string;
    language: BundledLanguage;
    showLineNumbers?: boolean;
  };

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

const lineNumberTransformer: ShikiTransformer = {
  name: "line-numbers",
  line(node, line) {
    node.children.unshift({
      type: "element",
      tagName: "span",
      properties: {
        className: [
          "inline-block",
          "min-w-10",
          "mr-4",
          "text-right",
          "select-none",
          "text-muted-foreground",
        ],
      },
      children: [{ type: "text", value: String(line) }],
    });
  },
};

export async function highlightCode(
  code: string,
  language: BundledLanguage,
  showLineNumbers = false
) {
  const transformers: ShikiTransformer[] = showLineNumbers
    ? [lineNumberTransformer]
    : [];

  return await Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: "one-light",
      transformers,
    }),
    codeToHtml(code, {
      lang: language,
      theme: "one-dark-pro",
      transformers,
    }),
  ]);
}

// Each rendered <pre> reads as a flat token-driven surface: shiki paints its own
// syntax colors inside, but the container, padding, and type are ours.
const preClasses =
  "scrollbar-thin overflow-auto [&>pre]:m-0 [&>pre]:bg-card! [&>pre]:p-4 [&>pre]:text-card-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm";

export const CodeBlock = ({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const [html, setHtml] = useState<string>("");
  const [darkHtml, setDarkHtml] = useState<string>("");
  const mounted = useRef(false);

  useEffect(() => {
    highlightCode(code, language, showLineNumbers).then(([light, dark]) => {
      if (!mounted.current) {
        setHtml(light);
        setDarkHtml(dark);
        mounted.current = true;
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [code, language, showLineNumbers]);

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn(codeBlockVariants(), className)}
        data-slot="code-block"
        {...props}
      >
        <div className="relative" data-slot="code-block-viewport">
          <div
            className={cn(preClasses, "dark:hidden")}
            data-slot="code-block-light"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "shiki output is trusted."
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div
            className={cn(preClasses, "hidden dark:block")}
            data-slot="code-block-dark"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "shiki output is trusted."
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />
          {children && (
            <div
              className="absolute top-2 right-2 flex items-center gap-2"
              data-slot="code-block-actions"
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      data-slot="code-block-copy-button"
      onClick={copyToClipboard}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};
