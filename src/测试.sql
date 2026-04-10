SELECT 
    name,                          
    SUM(score) AS total_score      
FROM user_score u                 

WHERE test_time >= '2025-01-01'    -- 限定 2025 年开始时间
AND test_time < '2026-01-01'       -- 限定 2025 年结束时间

AND score >= 60                    -- 过滤不及格成绩

AND score >= (                     -- 成绩必须>=当次考试平均分
    SELECT AVG(score)              
    FROM user_score
    WHERE test_time = u.test_time  
)

GROUP BY name                     

ORDER BY total_score DESC          

LIMIT 3;                           -- 取前三名

思路如下，
1.首先确定是2025年所以限定考试的时间在对应范围内
2.排除不及格所以成绩必须大于等于60
3.成绩必须大于等于当次考试的平均分，所以限定同一天考试就可以。
4.限定前三名

现有4个不同的业务，每个业务都需要查询1000w数据后存储到MongoDB表中。 
条件A：每个业务都有自己的业务实现，但是获取mysq1数据表是同一个。 
条件B：mysql数据库主键自增ID字段。 
条件C：MongoDB的存储要和mysq1的ID顺序保持一致。
如何用最少的代码或模式，并且最快速的还要按照顺序的完成Mysq1查询到MongoDB的存储？
请写出思路，要求用java代码方式实现。
思路如下
1.因为既然业务不同所以选择策略模式更加适合根据不同的业务匹配不同的逻辑同时
也可以使用模板方法模式来减少代码量，
2.因为mysql数据库主键自增ID字段，所以可以根据ID范围进行分片查询并且限制数量防止oom
3.因为MongoDB的存储要和mysq1的ID顺序保持一致，
所以查询的时候要按照ID顺序查询MongoDB按插入顺序存储
4.因为要最快速度，所以优先选择并发，四个业务根据id执行查询插入操作，互不干扰

