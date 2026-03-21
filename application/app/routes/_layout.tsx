import { Fragment, useCallback, useEffect, useId, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useLocation } from "react-router";

import { AppPage } from "@web-speed-hackathon-2026/client/app/components/application/AppPage";
import { AuthModalContainer } from "@web-speed-hackathon-2026/client/app/containers/AuthModalContainer";
import { NewPostModalContainer } from "@web-speed-hackathon-2026/client/app/containers/NewPostModalContainer";
import { fetchJSON, sendJSON } from "@web-speed-hackathon-2026/client/app/utils/fetchers";

export type LayoutOutletContext = {
  activeUser: Models.User | null;
  setActiveUser: (user: Models.User | null) => void;
  authModalId: string;
};

export function useLayoutOutletContext(): LayoutOutletContext {
  return useOutletContext<LayoutOutletContext>();
}

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [activeUser, setActiveUser] = useState<Models.User | null>(null);
  useEffect(() => {
    void fetchJSON<Models.User>("/api/v1/me")
      .then((user) => {
        setActiveUser(user);
      })
      .catch(() => {
        setActiveUser(null);
      });
  }, []);

  const authModalId = useId();
  const newPostModalId = useId();

  const handleLogout = useCallback(async () => {
    await sendJSON("/api/v1/signout", {});
    setActiveUser(null);
    navigate("/");
  }, [navigate]);

  return (
    <Fragment>
      <AppPage
        activeUser={activeUser}
        authModalId={authModalId}
        newPostModalId={newPostModalId}
        onLogout={handleLogout}
      >
        <Outlet context={{ activeUser, setActiveUser, authModalId } satisfies LayoutOutletContext} />
      </AppPage>
      <AuthModalContainer id={authModalId} onUpdateActiveUser={setActiveUser} />
      <NewPostModalContainer id={newPostModalId} />
    </Fragment>
  );
}
