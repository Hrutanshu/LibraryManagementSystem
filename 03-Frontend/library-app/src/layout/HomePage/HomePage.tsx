import { Carousel } from "./Components/Carousal";
import { ExploreTopBooks } from "./Components/ExploreTopBooks";
import { Heroes } from "./Components/Heroes";
import { LibraryServices } from "./Components/LibraryServices";

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks></ExploreTopBooks>
            <Carousel></Carousel>
            <Heroes></Heroes>
            <LibraryServices></LibraryServices>
        </>
    );
}