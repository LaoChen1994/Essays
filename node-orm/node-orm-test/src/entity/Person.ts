import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Grade } from "./Grade";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({
    length: 10,
  })
  type: string;

  @OneToOne((type) => Grade, (grade) => grade.headTeacher)
  class: Grade;
}
