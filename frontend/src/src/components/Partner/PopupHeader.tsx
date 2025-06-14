import { useTranslations } from "next-intl";    

const PopupHeader = ({ title }: { title: string }) => {
    const t = useTranslations();
    return <div className="bg-[#000] font-[30px] flex justify-start ml-[10px] items-center my-2">
       <h1 className="text-white font-bold text-[16px]">{t(title)}</h1>
    </div>;
};

export default PopupHeader;