DECLARE @ColumnName NVARCHAR(MAX) = 'DR_' + CAST(@Rating AS NVARCHAR);
DECLARE @SQL NVARCHAR(MAX) = 'SELECT ' + @ColumnName + ' FROM States WHERE StateName = @StateName';
EXEC sp_executesql @SQL, N'@StateName NVARCHAR(MAX)', @StateName;