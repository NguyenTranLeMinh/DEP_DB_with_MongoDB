***

Mô tả về tập dữ liệu: Tập dữ liệu US Adult Income chứa các thông tin về mức thu thập và các thông tin cá nhân của một số người ở nước Mỹ vào năm 1994. Tập dữ liệu gồm các trường như sau:

age: độ tuổi.
workclass: Hình thức làm việc.
total: Tổng số tiền trong tài khoản của cá nhân hoặc của người giám hộ.
education: Học vấn
education_num: Cấp độ học vấn.
marital_status: Tình trạng hôn nhân.
occupation: Nghề nghiệp.
relationship: Mối quan hệ với chủ hộ.
race: Chủng tộc.
gender: Giới tính.
capital_gain: Biến động số dư tăng trong tài khoản.
capital_loss: Biến động số dư giảm trong tài khoản.
hours_per_week: Số giờ làm việc trong tuần.
native_country: Quốc tịch.
income_bracket: mức thu nhập

***

Hướng dẫn

1. Phân tích được tập dữ liệu.

Dựa vào tập dữ liệu, bạn hãy thiết kế Database để có thể lưu được đầy đủ các dữ liệu đó. Lưu ý: Database của bạn cần phải có ít nhất 4 Collection và các Collection phải có liên kết với nhau. Ví dụ, với tập dữ liệu được cho ở phần “Tài nguyên”, bạn có thể thiết kế thành các Collection như sau với các trường tương ứng:

Collection user: chứa các thông tin cơ bản như tuổi, giới tính, chủng tộc, quốc tịch.
Collection education chứa các thông tin liên quan đến học vấn.
Collection occupation chứa các thông tin liên quan về nghề nghiệp,
Collection relationship chứa các thông tin về tình trạng hôn nhân.
Collection finance chứa các thông tin liên quan đến vấn đề tài chính.
2. Thiết kế được lược đồ của Database dựa trên các phân tích.

Sau khi thiết kế được Database, bạn hãy vẽ ERD để mô tả kiến trúc của Database đó. Ngoài ra, giữa SQL Server và MongoDB cũng có sự khác biệt khi bạn thiết kế các Database. Do đó bạn có thể tham khảo các link ở phần tài nguyên để hiểu được sự khác biệt khi thiết kế Database trên MongoDB và cách thể hiện ‘Embedded documents’’ trên ERD.

Ví dụ, ta có dữ liệu như sau:



Thì ta sẽ có một lược đồ tương tự như sau:



3. Viết được các câu lệnh để tạo Database theo như lược đồ đã thiết kế.

Ở bước này, bạn sẽ cần viết các câu lệnh dùng để Load dữ liệu từ Datasets vào các bảng theo sơ đồ mà bạn đã thiết kế. 

Đầu tiên, bạn cần import dữ liệu từ file csv thành một Collection tổng thông qua câu lệnh mongoimport

mongoimport --type csv -d <database> -c <collection> --headerline --drop <file>
Sau khi import, Collection sẽ có cấu trúc như sau:

[
  {
    "_id": {"$oid": "618d4016684ea9b976006628"},
    "age": 52,
    "capital_gain": 0,
    "capital_loss": 0,
    "education": "HS-grad",
    "education_num": 9,
    "gender": "Male",
    "hours_per_week": 45,
    "income_bracket": ">50K",
    "marital_status": "Married-civ-spouse",
    "native_country": "United-States",
    "occupation": "Exec-managerial",
    "race": "White",
    "relationship": "Husband",
    "total": 209642,
    "workclass": "Self-emp-not-inc"
  },
  {
    "_id": {"$oid": "618d4016684ea9b976006629"},
    "age": 31,
    "capital_gain": 14084,
    "capital_loss": 0,
    "education": "Masters",
    "education_num": 14,
    "gender": "Female",
    "hours_per_week": 50,
    "income_bracket": ">50K",
    "marital_status": "Never-married",
    "native_country": "United-States",
    "occupation": "Prof-specialty",
    "race": "White",
    "relationship": "Not-in-family",
    "total": 45781,
    "workclass": "Private"
  },
  ...
]
Tiếp theo, bạn cần load dữ liệu cho các Collection không có chứa khóa ngoại tới các Collection khác, ví dụ như Collection education, finance, occupation, relationship, ... Để có thể lấy dữ liệu từ Collection tổng và thêm vào một Collection khác, bạn có thể sử dụng function như sau:

use dep302_asm2;

function loadEducation() {
	const bulkInsert = db.education.initializeUnorderedBulkOp();
	// Get all Documents in 'full' Collection
	const documents = db.full.find({});

	// Process each document
	documents.forEach(function (doc) {
		const element = {
			education: doc.education
		};
		// Upsert into education Document
		bulkInsert.find(element).upsert().replaceOne(element);
	});
	bulkInsert.execute();
	return true;
}
Lưu ý:  Do MongoDB Script được viết dựa trên ngôn ngữ Javascript, vậy nên bạn sẽ cần chỉnh sửa lại function ở trên để phù hợp với cấu trúc Collection của bạn.

Sau khi chạy được function trên, Document education sẽ có dữ liệu như sau:


[
  {
    "_id": {"$oid": "618d407c228e433d52e75f1e"},
    "education": "HS-grad"
  },
  {
    "_id": {"$oid": "618d407c228e433d52e75f1f"},
    "education": "Masters"
  },
  ...
]
Cuối cùng, bạn sẽ cần import dữ liệu cho Collection chứa khóa ngoại như Colletion user bằng cách sử dụng function sau:

function loadUser() {
	const bulkInsert = db.user.initializeUnorderedBulkOp();
	// Get all Documents in 'full' Collection
	const documents = db.full.find({});

	// Process each document
	documents.forEach(function (doc) {
		const element = {
			age: doc.age,
			gender: doc.gender,
			native_country: doc.native_country,
			race: doc.race,
		};

		// Get education PK
		const education = db.education.findOne({
			education: doc.education
		});
		element.education_id = education._id;

		// Upsert into user collection
		bulkInsert.find(element).upsert().replaceOne(element);
	});

	bulkInsert.execute();
	return true;
}
Bạn sẽ cần chỉnh sửa lại function trên để phù hợp với Database vừa xây dựng. Sau khi thực thi function, bạn sẽ được kết quả như sau:

[
  {
    "_id": {"$oid": "618d42d5228e433d52e9c462"},
    "age": 52,
    "education_id": {"$oid": "618d407c228e433d52e75f1e"},
    "finance_id": {"$oid": "618d4080228e433d52e75f51"},
    "gender": "Male",
    "native_country": "United-States",
    "occupation_id": {"$oid": "618d418b228e433d52e7bd10"},
    "race": "White",
    "relationship_id": {"$oid": "618d4194228e433d52e7c71a"}
  },
  {
    "_id": {"$oid": "618d42d5228e433d52e9c463"},
    "age": 31,
    "education_id": {"$oid": "618d407c228e433d52e75f1f"},
    "finance_id": {"$oid": "618d4080228e433d52e75f52"},
    "gender": "Female",
    "native_country": "United-States",
    "occupation_id": {"$oid": "618d418c228e433d52e7bd11"},
    "race": "White",
    "relationship_id": {"$oid": "618d4194228e433d52e7c71b"}
  },
  ...
]
Vậy là bạn đã hoàn thành việc import dữ liệu từ file csv vào Database.

4. Liệt kê được các Business Query (truy vấn nghiệp vụ) và viết các câu lệnh để thực hiện các truy vấn đó.

Sau khi đã tạo và thêm một số dữ liệu mẫu vào Database. Bạn hãy xác định các truy vấn nghiệp vụ của hệ thống, một số ví dụ như:

4.1 Có bao nhiêu người là Nữ và làm việc nhiều hơn 30 tiếng / tuần ?
	
4.2 Có bao nhiêu người ở Mỹ có mức thu nhập > 50K
	
4.3 Tính tổng số dư tài khoản của những người đang ở Mỹ.
	
4.4 Tính tổng số giờ làm việc một tuần của những người có mức thu nhập <= 50K
									
4.5 Tìm những người có tổng số tiền trong tài khoản > 100000 và có số giờ làm việc hàng tuần < 55.
											      
Bạn cần liệt kê tối thiểu là 5 truy vấn nghiệp vụ như vậy. Sau đó hãy viết các câu lệnh để thực hiện truy vấn đó.


 5. (Yêu cầu nâng cao) Xây dựng Index cho các Collection

Để tăng tốc cho việc truy vấn dữ liệu, bạn hãy thiết lập các chỉ mục cho từng Collection để truy vấn nhanh hơn. Đồng thời bạn cũng phải giải thích được tại sao lại xây dựng Index như vậy.
