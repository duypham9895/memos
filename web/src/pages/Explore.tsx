import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGlobalStore, useLocationStore, useMemoStore, useUserStore } from "../store/module";
import { DEFAULT_MEMO_LIMIT } from "../helpers/consts";
import useLoading from "../hooks/useLoading";
import toastHelper from "../components/Toast";
import MemoContent from "../components/MemoContent";
import MemoResources from "../components/MemoResources";
import MemoFilter from "../components/MemoFilter";
import Icon from "../components/Icon";
import { TAG_REG } from "../labs/marked/parser";
import "../less/explore.less";

interface State {
  memos: Memo[];
}

const Explore = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const globalStore = useGlobalStore();
  const locationStore = useLocationStore();
  const userStore = useUserStore();
  const memoStore = useMemoStore();
  const query = locationStore.state.query;
  const [state, setState] = useState<State>({
    memos: [],
  });
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const loadingState = useLoading();
  const customizedProfile = globalStore.state.systemStatus.customizedProfile;
  const user = userStore.state.user;
  const location = locationStore.state;

  useEffect(() => {
    memoStore.fetchAllMemos(DEFAULT_MEMO_LIMIT, 0).then((memos) => {
      if (memos.length < DEFAULT_MEMO_LIMIT) {
        setIsComplete(true);
      }
      setState({
        memos,
      });
      loadingState.setFinish();
    });
  }, [location]);

  const { tag: tagQuery, text: textQuery } = query ?? {};
  const showMemoFilter = Boolean(tagQuery || textQuery);

  const shownMemos = showMemoFilter
    ? state.memos.filter((memo) => {
        let shouldShow = true;

        if (tagQuery) {
          const tagsSet = new Set<string>();
          for (const t of Array.from(memo.content.match(new RegExp(TAG_REG, "g")) ?? [])) {
            const tag = t.replace(TAG_REG, "$1").trim();
            const items = tag.split("/");
            let temp = "";
            for (const i of items) {
              temp += i;
              tagsSet.add(temp);
              temp += "/";
            }
          }
          if (!tagsSet.has(tagQuery)) {
            shouldShow = false;
          }
        }
        return shouldShow;
      })
    : state.memos;

  const sortedMemos = shownMemos.filter((m) => m.rowStatus === "NORMAL");
  const handleFetchMoreClick = async () => {
    try {
      const fetchedMemos = await memoStore.fetchAllMemos(DEFAULT_MEMO_LIMIT, state.memos.length);
      if (fetchedMemos.length < DEFAULT_MEMO_LIMIT) {
        setIsComplete(true);
      } else {
        setIsComplete(false);
      }
      setState({
        memos: state.memos.concat(fetchedMemos),
      });
    } catch (error: any) {
      console.error(error);
      toastHelper.error(error.response.data.message);
    }
  };

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "tag-span") {
      const tagName = targetEl.innerText.slice(1);
      const currTagQuery = locationStore.getState().query?.tag;
      if (currTagQuery === tagName) {
        locationStore.setTagQuery(undefined);
      } else {
        locationStore.setTagQuery(tagName);
      }
    }
  };

  const handleTitleClick = () => {
    if (user) {
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="page-wrapper explore">
      <div className="page-container">
        <div className="page-header">
          <div className="title-container cursor-pointer hover:opacity-80" onClick={handleTitleClick}>
            <img className="logo-img" src={customizedProfile.logoUrl} alt="" />
            <span className="title-text">{customizedProfile.name}</span>
          </div>
          <div className="flex flex-row justify-end items-center">
            <a
              className="flex flex-row justify-center items-center h-12 w-12 border rounded-full hover:opacity-80 hover:shadow dark:text-white "
              href="/explore/rss.xml"
              target="_blank"
              rel="noreferrer"
            >
              <Icon.Rss className="w-7 h-auto opacity-60" />
            </a>
          </div>
        </div>
        {!loadingState.isLoading && (
          <main className="memos-wrapper">
            <MemoFilter />
            {sortedMemos.map((memo) => {
              const createdAtStr = dayjs(memo.createdTs).locale(i18n.language).format("YYYY/MM/DD HH:mm:ss");
              return (
                <div className={`memo-container ${memo.pinned ? "pinned" : ""}`} key={memo.id}>
                  {memo.pinned && <div className="corner-container"></div>}
                  <div className="memo-header">
                    <span className="time-text">{createdAtStr}</span>
                    <a className="name-text" href={`/u/${memo.creatorId}`}>
                      @{memo.creatorName}
                    </a>
                  </div>
                  <MemoContent className="memo-content" content={memo.content} onMemoContentClick={handleMemoContentClick} />
                  <MemoResources resourceList={memo.resourceList} />
                </div>
              );
            })}
            {isComplete ? (
              state.memos.length === 0 ? (
                <p className="w-full text-center mt-12 text-gray-600">{t("message.no-memos")}</p>
              ) : null
            ) : (
              <p
                className="m-auto text-center mt-4 italic cursor-pointer text-gray-500 hover:text-green-600"
                onClick={handleFetchMoreClick}
              >
                {t("memo-list.fetch-more")}
              </p>
            )}
          </main>
        )}
      </div>
    </section>
  );
};

export default Explore;
