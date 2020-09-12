import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./Person";

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: "20",
    nullable: false,
  })
  name: string;

  @OneToOne((type) => Person, (person) => person.class)
  @JoinColumn()
  headTeacher: Person;
}
