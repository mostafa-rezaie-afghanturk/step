import { CalendarDateRangeIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { FaCalendarCheck } from 'react-icons/fa6';
import { LuCalendarCheck, LuCalendarClock } from 'react-icons/lu';
import { TbTimelineEventExclamation } from 'react-icons/tb';

const SingleViewHeader = ({
    setOpen,
    name,
    status,
    code,
    createdAt,
    updatedAt,
}) => {
    const { i18n } = useTranslation();
    return (
        <>
            <div className="bg-brand min-h-24 w-full rounded-md flex flex-wrap items-center justify-between ps-4 pe-14 z-10 ">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div className="w-[80px] h-[80px] rounded-full flex justify-center items-center text-2xl bg-slate-50 overflow-hidden">
                        {code
                            ? code
                            : name
                              ? name[0].toUpperCase() + name[1].toUpperCase()
                              : ''}
                    </div>

                    <div className="ms-2">
                        <div>
                            <div className="text-3xl text-white">{name}</div>
                            {status && (
                                <div>
                                    <div className=" rounded-2xl w-fit px-2  bg-cyan-400 ">
                                        {status}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex">
                        <div className="bg-cyan-400/50 px-2 sm:px-4 py-1 rounded-2xl flex text-sm text-white">
                            <div className="flex items-center">
                                <LuCalendarCheck className="me-1" />
                                <p>
                                    {moment(createdAt).format(
                                        'YYYY MM DD hh:mm A'
                                    )}
                                </p>
                            </div>
                            <div className="w-[1px] h-[22px] bg-gray-200 mx-2"></div>
                            <div className="flex items-center">
                                <LuCalendarClock className="me-1" />
                                <p>
                                    {moment(updatedAt).format(
                                        'YYYY MM DD hh:mm A'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={() => {
                    setOpen(false);
                }}
                className={`absolute top-4 group z-20 ${i18n.dir() == 'rtl' ? 'left-4' : ' right-4'}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </button>
        </>
    );
};

export default SingleViewHeader;
