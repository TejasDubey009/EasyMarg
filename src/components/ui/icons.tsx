import type { SVGProps } from "react";

/* A small set of 16px line icons. Each one stands for a real action or object. */

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </Icon>
);

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" />
  </Icon>
);

export const Check = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="m3 8.5 3.2 3.2L13 4.8" />
  </Icon>
);

export const Upload = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M8 10.5v-8M4.5 5.5 8 2l3.5 3.5M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
  </Icon>
);

export const Download = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M8 2v8M4.5 7 8 10.5 11.5 7M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
  </Icon>
);

export const Paper = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M9 1.5H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8L9 1.5Z" />
    <path d="M9 1.5v4h4" />
  </Icon>
);

export const Search = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </Icon>
);

export const Close = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
  </Icon>
);

export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M2 4.5h12M2 8h12M2 11.5h12" />
  </Icon>
);

export const Alert = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M8 2 1.5 13.5h13L8 2Z" />
    <path d="M8 6.5v3.2M8 11.6v.1" />
  </Icon>
);

export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="m4 6 4 4 4-4" />
  </Icon>
);

export const ArrowUp = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7" />
  </Icon>
);
