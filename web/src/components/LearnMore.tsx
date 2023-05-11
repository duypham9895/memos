import { useTranslation } from "react-i18next";
import Icon from "./Icon";

interface Props {
  url: string;
  className?: string;
}

const LearnMore = (props: Props) => {
  const { url, className } = props;
  const { t } = useTranslation();

  return (
    <a className={`${className || ""} text-sm text-blue-600 hover:opacity-80 hover:underline`} href={url} target="_blank">
      {t("common.learn-more")}
      <Icon.ExternalLink className="inline -mt-1 ml-1 w-4 h-auto opacity-80" />
    </a>
  );
};

export default LearnMore;
