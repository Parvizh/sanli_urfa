const listColumn = (props: any) => {

    const { record } = props;
    const { property } = props;

    return record.params[`contacts.${property.name}`]
}

export default listColumn;
