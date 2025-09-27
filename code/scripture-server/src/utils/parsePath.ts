export const parsePath = (req: Request) => {
    const url = new URL(req.url);
    return {
        path: url.pathname.split("/").filter((item) => item !== ""),
        pathname: url.pathname,
        searchParams: url.searchParams,
    };
};
