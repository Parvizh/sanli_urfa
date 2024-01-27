import {
  Button,
  DropDown,
  DropDownItem,
  DropDownMenu,
  DropDownTrigger,
} from '@adminjs/design-system';
import { ActionProps, useCurrentAdmin } from 'adminjs';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';

const ViewAddresses = (props: ActionProps) => {
  const { record } = props;
  const [currentAdmin] = useCurrentAdmin();
  const [user, setUser] = useState(null);

  const url = '/user/' + record.params.id;

  useEffect(() => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + currentAdmin.token,
        },
      })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    user && (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      <DropDown>
        <DropDownTrigger>
          <Button>View orders</Button>
        </DropDownTrigger>
        <DropDownMenu>
          {user.orders.length > 0 ?
            user.orders.map((order: any, index: number) => {
              return (
                <DropDownItem>
                  <DropDown>
                    <DropDownTrigger>
                      <Button>Order #{index + 1}</Button>
                    </DropDownTrigger>
                    <DropDownMenu>
                      <DropDownItem>
                        <pre>{JSON.stringify(order, null, '\t')}</pre>
                      </DropDownItem>
                    </DropDownMenu>
                  </DropDown>
                </DropDownItem>
              );
            }) : <DropDownItem>There are no orders</DropDownItem>}
        </DropDownMenu>
      </DropDown>
      <br/>
      </div>
    )
  );
};

export default ViewAddresses;
