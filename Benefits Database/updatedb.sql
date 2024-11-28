DECLARE @Rating INT = 10; -- Initialize the disability rating
DECLARE @StateName NVARCHAR(MAX); -- Variable to hold the state name
DECLARE @FilePath NVARCHAR(MAX); -- Variable to hold the file path
DECLARE @ColumnName NVARCHAR(MAX); -- Variable to hold the column name
DECLARE @SQL NVARCHAR(MAX); -- Variable to hold the dynamic SQL
DECLARE @RowCount INT; -- Variable to check if the file has data

-- Start the loop for each state
DECLARE @StateCursor CURSOR;
SET @StateCursor = CURSOR FOR
    SELECT StateName FROM States; -- Get all the state names

OPEN @StateCursor;

FETCH NEXT FROM @StateCursor INTO @StateName;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Reset the rating for each state and loop through the disability ratings
    SET @Rating = 10;

    WHILE @Rating <= 100
    BEGIN
        -- Construct the file path dynamically based on the state and disability rating
        SET @FilePath = 'C:\Dev\dev\School\CS3300\VA-Benefits-Tool\States\' + @StateName + '\' + CAST(@Rating AS NVARCHAR) + '\' + CAST(@Rating AS NVARCHAR) + '.txt';

        -- Construct the column name dynamically
        SET @ColumnName = 'DR_' + CAST(@Rating AS NVARCHAR);

        -- Step 1: Create a temporary table
        IF OBJECT_ID('tempdb..#TempText') IS NOT NULL
        BEGIN
            DROP TABLE #TempText;
        END
        CREATE TABLE #TempText (TextContent NVARCHAR(MAX));

        -- Step 2: Load the file into the temporary table
        BEGIN TRY
            SET @SQL = N'
            BULK INSERT #TempText
            FROM ''' + @FilePath + N'''
            WITH (
                ROWTERMINATOR = ''\n'', 
                FIELDTERMINATOR = ''\n'',
                CODEPAGE = ''65001''
            );
            ';
            EXEC sp_executesql @SQL;
        END TRY
        BEGIN CATCH
            -- Handle the case where the file is not found or another error occurs
            PRINT 'Error with BULK INSERT for ' + @StateName + ' and Rating ' + CAST(@Rating AS NVARCHAR);
            -- Insert "No Benefits" if the file is missing or invalid
            SET @SQL = N'UPDATE States SET ' + @ColumnName + N' = ''No Benefits'' WHERE StateName = @StateName';
            EXEC sp_executesql @SQL, N'@StateName NVARCHAR(MAX)', @StateName;
            DROP TABLE #TempText;
            BREAK;
        END CATCH;

        -- Step 3: Check if the file is empty and handle it accordingly
        SELECT @RowCount = COUNT(*) FROM #TempText;

        IF @RowCount = 0
        BEGIN
            -- If no rows were inserted, update with "No Benefits"
            SET @SQL = N'UPDATE States SET ' + @ColumnName + N' = ''No Benefits'' WHERE StateName = @StateName';
            EXEC sp_executesql @SQL, N'@StateName NVARCHAR(MAX)', @StateName;
        END
        ELSE
        BEGIN
            -- If rows exist, update the table with the file content
            SET @SQL = N'UPDATE States SET ' + @ColumnName + N' = (SELECT TextContent FROM #TempText) WHERE StateName = @StateName';
            EXEC sp_executesql @SQL, N'@StateName NVARCHAR(MAX)', @StateName;
        END

        -- Step 4: Drop the temporary table
        DROP TABLE #TempText;

        -- Increment the disability rating
        SET @Rating = @Rating + 10;
    END

    -- Move to the next state
    FETCH NEXT FROM @StateCursor INTO @StateName;
END

-- Close and deallocate the cursor
CLOSE @StateCursor;
DEALLOCATE @StateCursor;
