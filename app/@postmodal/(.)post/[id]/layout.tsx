import InterceptingModal from "@/components/modals/InterceptingModal";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <InterceptingModal hideCloseButton size="xl">{children}</InterceptingModal>;
}
