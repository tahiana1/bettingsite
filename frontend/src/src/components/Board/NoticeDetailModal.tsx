"use client"

import React from "react";
import { Card } from "antd";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import modalImage from '@/assets/img/main/modal-head.png';

interface NoticeDetailModalProps {
    notice: any;
    onClose: () => void;
    type?: 'notice' | 'event';
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, onClose, type = 'notice' }) => {
    const t = useTranslations();

    if (!notice) {
        return null;
    }

    const modalTitle = type === 'event' ? t("events") : t("notice");

    return (
        <Card
            title={
                <div className="relative">
                    <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{modalTitle}</h2>
                    <p className="text-white text-[14px] font-[400] justify-center pb-6 flex">{modalTitle}</p>
                    <div className="absolute bottom-2 right-0 flex gap-2">
                        <button 
                            onClick={onClose} 
                            className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex"
                        >
                            {t("close")}
                        </button>
                    </div>
                </div>
            }
            styles={{
                header: {
                    backgroundImage: `url(${modalImage.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderBottom: '1px solid #3e2e23',
                },
                body: {
                    backgroundColor: '#160d0c',
                    borderTop: '1px solid #3e2e23',
                    padding: '24px'
                }
            }}
            classNames={{
                actions: "!p-1",
                body: "!px-2",
            }}
            className="w-full bg-[#160d0c] border-none"
        >
            <div className="p-4 bg-[#160d0c] text-white">
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 text-[#edd497]">{notice.title}</h3>
                    <div className="text-sm text-gray-400 mb-4">
                        <span>Published: {dayjs(notice.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                        {notice.views && <span className="ml-4">{t("views")}: {notice.views}</span>}
                    </div>
                </div>
                
                <div className="border-t border-[#3e2e23] pt-4">
                    <div className="text-white leading-relaxed">
                        {notice.description ? (
                            <div dangerouslySetInnerHTML={{ __html: notice.description }} />
                        ) : (
                            <p>No content available</p>
                        )}
                    </div>
                </div>

                {notice.mainImage && (
                    <div className="mt-4 border-t border-[#3e2e23] pt-4">
                        <img 
                            src={notice.mainImage} 
                            alt={notice.title} 
                            className="max-w-full h-auto rounded"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default NoticeDetailModal;
