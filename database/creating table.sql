create database db


create table posts (
    id int identity(1,1) primary key,
    [desc] varchar(200) null,
    img varchar(200) null,
    userid int not null,
    createdate datetime default getdate()
);

alter table posts
add constraint fk_posts_users
foreign key (userid)
references users(id)
on delete cascade
on update cascade;