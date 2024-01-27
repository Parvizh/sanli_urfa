import { Label } from '@adminjs/design-system';
import { ActionProps, useCurrentAdmin } from 'adminjs';
import * as React from "react";

const ShowSliderImage = (props: ActionProps) => {

    const { record } = props;

    const imageUrl = record.params.imageUrl;
    const srcImg = "/"+imageUrl;

    return (
        <div>
            <Label style={{color: '#898A9A'}}>Image</Label>
            <img src={srcImg} style={{width: "800px"}}/>
        </div>
    )
};

export default ShowSliderImage;