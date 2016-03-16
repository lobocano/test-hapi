select c.*, u.displayname from comments c
    join users u on c.owner = u.userid
     order by posttime desc;