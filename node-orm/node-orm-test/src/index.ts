import "reflect-metadata";
import { createConnection, Connection, Table } from "typeorm";
import { Photo, Person, Grade } from "./entity";
import { db_config } from "../ormconfig";

enum STUDENT_TYPE {
  STUDENT = "student",
  TEACHER = "teacher",
}

let conn: Connection = null;

const getSingleTableTest = async () => {
  let photo = new Photo();
  // 数据1
  photo.description = "这是一张老照片";
  photo.isPublished = true;
  photo.name = "出游照";
  photo.views = 1;
  // 数据2
  photo.description = "这是一张新照片";
  photo.isPublished = true;
  photo.name = "帅哥照";
  photo.views = 1;
  // 新增数据
  // await conn.manager.save(photo);
  // console.log("photo is inserted");

  // 查询表Photo的所有数据
  // const data = await conn.manager.find(Photo);

  // 使用repositories进行查询
  // Each entity has its own repository which handles all operations with its entity.
  // When you deal with entities a lot, Repositories are more convenient to use than EntityManagers:
  let photoRegistory = conn.getRepository(Photo);
  await photoRegistory.save(photo);

  // 使用find + where查询
  let photos: Photo[] | Photo = await photoRegistory.find({ views: 1 });
  const [allPhotos, count] = await photoRegistory.findAndCount({ views: 1 });

  // findOne 查询符合条件的第一张图
  photos = await photoRegistory.findOne({ views: 1 });

  // 使用repositories方式查询
  photos = await photoRegistory
    .createQueryBuilder("photos")
    .where("id >= :id", { id: 1 })
    .getMany();
  console.log("query photos = ", photos);
  console.log("query all phtotos = ", allPhotos);
  console.log("query count = ", count);

  // 改
  let photoUpdate = await photoRegistory.findOne({ id: 1 });
  photoUpdate.description = "迪丽热巴剧照";
  await photoRegistory.save(photoUpdate);
  console.log("已经更了id = 4 的图片描述");

  // 删除
  let [photoList, listCountBefore] = await photoRegistory.findAndCount();
  console.log(listCountBefore);

  let deleteItem = await photoRegistory.findOne({ id: 6 });
  deleteItem && photoRegistory.remove(deleteItem);
};

const oneToOneTest = async () => {
  // 连表插入 一对一 (单向)
  const teacher = new Person();
  const student = new Person();
  const grade = new Grade();

  const personResp = conn.getRepository(Person);
  const gradeResp = conn.getRepository(Grade);

  teacher.firstName = "Zhange";
  teacher.lastName = "San";
  teacher.type = STUDENT_TYPE.TEACHER;
  teacher.age = 24;

  grade.name = "Grade 3-1";
  grade.headTeacher = teacher;

  student.firstName = "Li";
  student.lastName = "Si";
  student.age = 8;
  student.type = STUDENT_TYPE.STUDENT;
  student.class = grade;

  await personResp.save(teacher);
  await gradeResp.save(grade);
  await personResp.save(student);

  console.log("all infomation is inserted");
};

createConnection(db_config)
  .then(async (connection) => {
    console.log("connection is over");
    conn = connection;
    // getSingleTableTest();
    // oneToOneTest();
    let gradeRepository = connection.getRepository(Grade);
    let person = await gradeRepository.find({ relations: ["headTeacher"] });
    console.log(person);
  })
  .catch((error) => console.log(error));
