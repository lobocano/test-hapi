create or replace function update_user (integer, timestamp) returns integer as $$
begin
    return 11;
end;
$$ LANGUAGE plpgsql;

