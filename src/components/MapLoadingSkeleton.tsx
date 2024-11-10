export default function MapLoadingSkeleton({ position = "relative" , paddingBottom = "0px"}: { position: any, paddingBottom: any }) {
    return (


        <div className={`${position == "absolute" ? "dcc-absolute dcc-top-0 dcc-w-full dcc-h-full" : ""} ${"dcc-map-loader"}`} style={{ paddingBottom: paddingBottom }}>
            <div className="dcc-relative dcc-h-full">
                    <div className="dcc-skeleton dcc-h-full dcc-w-full"></div>
                </div>
        </div>

    )
}
