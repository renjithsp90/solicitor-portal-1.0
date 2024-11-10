export default function LoadingSkeleton({ position = "relative" }: { position: any }) {
    return (


        <div className={`${"dcc-p-6 md:dcc-p-12 xl:dcc-p-24 dcc-z-10"} ${position == "absolute" ? "dcc-absolute dcc-top-0 dcc-w-full " : ""} `} >
            <div className="dcc-relative xl:dcc-max-w-[80%]">
                <div
                    className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sdcc-py-4 dcc-items-center dcc-gap-4 dcc-mb-4">
                    <div className="dcc-skeleton dcc-h-12 dcc-w-full"></div>
                </div>

                <div
                    className="dcc-grid dcc-grid-cols-2 dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-8 xl:dcc-max-w-[80%]">
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                </div>

                <div
                    className="dcc-grid dcc-grid-cols-2 dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-8 xl:dcc-max-w-[80%]">
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                </div>
                <div
                    className="dcc-grid dcc-grid-cols-2 dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-8 xl:dcc-max-w-[80%]">
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                </div>

                <div
                    className="dcc-grid dcc-grid-cols-2 dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-8 xl:dcc-max-w-[80%]">
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                </div>
                <div
                    className="dcc-grid dcc-grid-cols-2 dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-8 xl:dcc-max-w-[80%]">
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                    <div className="dcc-skeleton dcc-h-5 dcc-w-full"></div>
                </div>

                <div
                    className="dcc-relative dcc-max-w-[150px] dcc-mb-5">
                    <div className="dcc-skeleton dcc-h-16 dcc-w-full"></div>
                </div>

                <div className="dcc-skeleton dcc-h-8 dcc-w-[60%]"></div>

            </div>
        </div>

    )
}
