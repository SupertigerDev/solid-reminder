import style from "./BottomDrawer.module.scss";
import { createSignal, JSXElement, Show } from "solid-js";
import { mergeRefs, Ref } from "@solid-primitives/refs";

export interface BottomDrawerRef {
  toggle: () => void;
}

interface RootProps {
  children?: JSXElement;
  ref?: Ref<BottomDrawerRef>;
}
const Root = (props: RootProps) => {
  const [shown, setShown] = createSignal(true);

  mergeRefs(props.ref)({
    toggle() {
      setTimeout(() => {
        setShown(!shown());
      }, 100);
    },
  });

  const onBackgroundClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      setShown(false);
    }
  };

  return (
    <Show when={shown()}>
      <div class={style.background} onClick={onBackgroundClick}>
        <div class={style.container}>{props.children}</div>
      </div>
    </Show>
  );
};

interface HeaderProps {
  title: string;
}
const Header = (props: HeaderProps) => {
  return <h4 class={style.header}>{props.title}</h4>;
};

interface ContentProps {
  children?: JSXElement;
  class?: string;
}
const Content = (props: ContentProps) => {
  return (
    <div class={`${style.content} ${props.class || ""}`}>{props.children}</div>
  );
};

interface FooterProps {
  children?: JSXElement;
}
const Footer = (props: FooterProps) => {
  return <div class={style.footer}>{props.children}</div>;
};

export const BottomDrawer = {
  Root,
  Header,
  Content,
  Footer,
};
