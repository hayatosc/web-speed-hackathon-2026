import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { Helmet, HelmetProvider } from "react-helmet";
import { Route, Routes, useLocation, useNavigate } from "react-router";

import { AppPage } from "@web-speed-hackathon-2026/client/src/components/application/AppPage";
import { AuthModalContainer } from "@web-speed-hackathon-2026/client/src/containers/AuthModalContainer";
import { NewPostModalContainer } from "@web-speed-hackathon-2026/client/src/containers/NewPostModalContainer";
import { TimelineContainer } from "@web-speed-hackathon-2026/client/src/containers/TimelineContainer";
import { fetchJSON, sendJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

const LazyCrokContainer = lazy(async () => {
  const { CrokContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/CrokContainer");
  return { default: CrokContainer };
});

const LazyDirectMessageContainer = lazy(async () => {
  const { DirectMessageContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/DirectMessageContainer");
  return { default: DirectMessageContainer };
});

const LazyDirectMessageListContainer = lazy(async () => {
  const { DirectMessageListContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/DirectMessageListContainer");
  return { default: DirectMessageListContainer };
});

const LazyNotFoundContainer = lazy(async () => {
  const { NotFoundContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/NotFoundContainer");
  return { default: NotFoundContainer };
});

const LazyPostContainer = lazy(async () => {
  const { PostContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/PostContainer");
  return { default: PostContainer };
});

const LazySearchContainer = lazy(async () => {
  const { SearchContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/SearchContainer");
  return { default: SearchContainer };
});

const LazyTermContainer = lazy(async () => {
  const { TermContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/TermContainer");
  return { default: TermContainer };
});

const LazyUserProfileContainer = lazy(async () => {
  const { UserProfileContainer } =
    await import("@web-speed-hackathon-2026/client/src/containers/UserProfileContainer");
  return { default: UserProfileContainer };
});

const RouteFallback = ({ title = "読込中 - CaX" }: { title?: string }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="text-cax-text-muted p-4">読込中...</div>
    </>
  );
};

function withSuspense(children: ReactNode, title?: string): ReactNode {
  return <Suspense fallback={<RouteFallback title={title} />}>{children}</Suspense>;
}

export const AppContainer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [activeUser, setActiveUser] = useState<Models.User | null>(null);
  const [isLoadingActiveUser, setIsLoadingActiveUser] = useState(true);
  useEffect(() => {
    void fetchJSON<Models.User>("/api/v1/me")
      .then((user) => {
        setActiveUser(user);
      })
      .finally(() => {
        setIsLoadingActiveUser(false);
      });
  }, [setActiveUser, setIsLoadingActiveUser]);
  const handleLogout = useCallback(async () => {
    await sendJSON("/api/v1/signout", {});
    setActiveUser(null);
    navigate("/");
  }, [navigate]);

  const authModalId = useId();
  const newPostModalId = useId();

  if (isLoadingActiveUser) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>読込中 - CaX</title>
        </Helmet>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <AppPage
        activeUser={activeUser}
        authModalId={authModalId}
        newPostModalId={newPostModalId}
        onLogout={handleLogout}
      >
        <Routes>
          <Route element={<TimelineContainer />} path="/" />
          <Route
            element={withSuspense(
              <LazyDirectMessageListContainer activeUser={activeUser} authModalId={authModalId} />,
            )}
            path="/dm"
          />
          <Route
            element={withSuspense(
              <LazyDirectMessageContainer activeUser={activeUser} authModalId={authModalId} />,
            )}
            path="/dm/:conversationId"
          />
          <Route element={withSuspense(<LazySearchContainer />)} path="/search" />
          <Route element={withSuspense(<LazyUserProfileContainer />)} path="/users/:username" />
          <Route element={withSuspense(<LazyPostContainer />)} path="/posts/:postId" />
          <Route element={withSuspense(<LazyTermContainer />)} path="/terms" />
          <Route
            element={withSuspense(
              <LazyCrokContainer activeUser={activeUser} authModalId={authModalId} />,
            )}
            path="/crok"
          />
          <Route element={withSuspense(<LazyNotFoundContainer />)} path="*" />
        </Routes>
      </AppPage>

      <AuthModalContainer id={authModalId} onUpdateActiveUser={setActiveUser} />
      <NewPostModalContainer id={newPostModalId} />
    </HelmetProvider>
  );
};
