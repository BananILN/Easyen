import { LESSON_ROUTE } from "..";
import { LinkButton } from "../components/LinkButton";
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="main-home">
        <div className="content-home">
          <div className="text-content">
            <h1 className="title-desc">
              {t("home_title")}
            </h1>
            <span className="span-under-title-desc">
              {t("home_subtitle")}
            </span>
            <LinkButton to={LESSON_ROUTE} title={t("lesson")} />
          </div>
          <div className="image-cont">
            <img src="src\assets\blurgame 6.png" className="blurGame" alt={t("home_title")} />
            <img src="src\assets\pep.png" className="pep" alt={t("home_subtitle")} />
            <img src="src\assets\blurPlant.png" className="blurPlant" alt="" />
          </div>
        </div>

        <div className="learn-lang-main">
          <div className="learn-img-cont">
            <img src="src\assets\learnWpng.png" alt={t("learn_language_title")} />
          </div>
          <div className="learn-content">
            <div className="learn-title">{t("learn_language_title")}</div>
            <div className="learn-text">{t("learn_language_text")}</div>
          </div>
        </div>

        <div className="res-into">
          <div className="res-info-content">
            <div className="res-info-title">{t("increase_vocabulary_title")}</div>
            <div className="res-info-text">
              {t("increase_vocabulary_text")}
            </div>
          </div>
          <div className="res-info-img">
            <img src="src\assets\rse.png" alt={t("increase_vocabulary_title")} />
          </div>
        </div>

        <div className="watch-prog">
          <div className="w-prog-img">
            <img src="src\assets\Statimg.png" alt={t("watch_progress_title")} />
          </div>
          <div className="w-prog-content">
            <div className="w-prog-title">{t("watch_progress_title")}</div>
            <div className="w-prog-text">
              {t("watch_progress_text")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}