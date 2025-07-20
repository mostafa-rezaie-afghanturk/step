import { useTranslation } from 'react-i18next';

const SingleRow = props => {
    const {
        singleRow = false,
        itemName,
        itemText,
        itemName2,
        itemText2,
        bgColor = false,
    } = props;

    const { t } = useTranslation();

    return (
        <div>
            {singleRow ? (
                <div
                    className={`grid md:grid-cols-12 sm:grid-cols-1 text-sm m-0 ${bgColor ? 'bg-gray-200' : 'bg-transparent'}`}
                >
                    <div className="md:py-2 px-4 md:col-span-2 font-semibold text-gray-950">
                        {t(itemName)}
                    </div>
                    <div className="md:py-2 px-4 md:col-span-10 font-normal text-gray-800">
                        {itemText}
                    </div>
                </div>
            ) : (
                <div
                    className={`grid md:grid-cols-2 sm:grid-cols-1 text-sm m-0 ${bgColor ? 'bg-gray-200' : 'bg-transparent'}`}
                >
                    <div className="flex md:py-2 px-4">
                        <div className="w-[40%] font-semibold text-gray-950">
                            {t(itemName)}
                        </div>
                        <div className="font-normal text-gray-800">
                            {itemText}
                        </div>
                    </div>
                    <div className="flex md:py-2 px-4">
                        <div className="w-[40%] font-semibold text-gray-950">
                            {t(itemName2)}
                        </div>
                        <div className="font-normal text-gray-800">
                            {itemText2}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleRow;
