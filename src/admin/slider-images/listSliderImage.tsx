import { Box } from "@adminjs/design-system";
import { ActionProps } from "adminjs";
import * as React from "react";

const listSliderImage = (props: ActionProps) => {
    const { record } = props;

    const imageUrl = record.params.imageUrl;
    const srcImg = "/"+imageUrl;

    return (
        <Box >
            {imageUrl ? (
                <img src={srcImg} style={{width: "200px"}}/>
            ) : 'No image'}
        </Box>
    );
    
}

export default listSliderImage;